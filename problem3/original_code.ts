interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

class Datasource {
  // TODO: Implement datasource class
}

interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
	const [prices, setPrices] = useState({});

  /**
   * 1. Typo in Error Logging. Instead of "console.err", use "console.error".
   * 2. The fetch request is not cleaned up when the component unmounts.
   * If the component unmounts before the fetch request completes, 
   * React might try to update the setPrices state on an unmounted component, 
   * which wastes network resources and results in memory leak.
   * Fix: Use AbortController: allows us to cancel the fetch request when the component unmounts.
   */ 
  useEffect(() => {
    const datasource = new Datasource("https://interview.switcheo.com/prices.json");
    datasource.getPrices().then(prices => {
      setPrices(prices);
    }).catch(error => {
      console.err(error);
    });
  }, []);

  /**
   * 1. Can have multiple calls for same blockchain. 
   * Fix by memoizing with useCallback for optimization.
   * 2. (blockchain: any) disables type checking. Benefits of type checking include type safety,
   * which prevents passing unintended types (e.g., numbers, objects, booleans).
   * Fix by using (blockchain: string) in this case
   */
	const getPriority = (blockchain: any): number => {
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}

  /**
   * 1. lhsPriority is undefined. Should use balancePriority instead.
   * 2. balance.amount should be > 0 assuming you want wallets with positive balance.
   * 3. Sort Function does not handle the case of (leftPriority === rightPriority). Should return 0.
   * 4. prices is included in the dependancy array of sortedBalances, but it isn't used.
   * Should include getPriority in dependancy array.
   */
  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
		  if (lhsPriority > -99) {
		     if (balance.amount <= 0) {
		       return true;
		     }
		  }
		  return false
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  }
    });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })

  /**
   * 1. formattedBalances not utilized: rows is still mapped from sortedBalances, not formattedBalances.
   * Use formattedBalances to include formatted amounts.
   * 2. Using an array index as the key in React can cause unwanted rendering issues.
   * Example issue: If items are re-sorted or removed, React cannot track elements correctly,
   * leading to incorrect updates.
   * Fix: Use a unique identifier e.g. "balance.currency" instead of "index".
   */
  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

class Datasource {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async getPrices(signal?: AbortSignal): Promise<Record<string, number>> {
    const response = await fetch(this.url, { signal });
    if (!response.ok) throw new Error('Failed to fetch prices');
    const prices = await response.json();
    return prices.reduce((acc: Record<string, number>, { currency, price }: { currency: string; price: number }) => {
      acc[currency] = price;
      return acc;
    }, {});
  }
}

const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
  const balances = useWalletBalances();
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    const abortController = new AbortController();
    const datasource = new Datasource("https://interview.switcheo.com/prices.json");
    datasource.getPrices(abortController.signal)
      .then(setPrices)
      .catch(error => {
        if (error.name !== 'AbortError') console.error(error);
      });
    return () => abortController.abort();
  }, []);

  const getPriority = useCallback((blockchain: string): number => {
    switch (blockchain) {
      case 'Osmosis': return 100;
      case 'Ethereum': return 50;
      case 'Arbitrum': return 30;
      case 'Zilliqa': case 'Neo': return 20;
      default: return -99;
    }
  }, []);

  const sortedBalances = useMemo(() => balances
    .filter(balance => getPriority(balance.blockchain) > -99 && balance.amount > 0)
    .sort((a, b) => {
      const aPriority = getPriority(a.blockchain);
      const bPriority = getPriority(b.blockchain);
      return bPriority - aPriority; // Descending order
    }), [balances, getPriority]);

  const formattedBalances = sortedBalances.map(balance => ({
    ...balance,
    formatted: balance.amount.toFixed()
  }));

  const rows = formattedBalances.map(balance => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        key={balance.currency}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
        className={classes.row}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};
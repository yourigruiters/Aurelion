import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { tradeResource } from "../store/resourcesSlice";
import { RootState } from "../store/store";
import {
  Coins,
  ShoppingBag,
  BadgeDollarSign,
  ArrowRightLeft,
} from "lucide-react";
import Button from "../components/ui/Button";
import ResourceIcon from "../components/ui/ResourceIcon";

interface TradeItem {
  id: string; // Resource key
  name: string;
  basePrice: number;
}

const TRADE_ITEMS: TradeItem[] = [
  {
    id: "population",
    name: "Population",
    basePrice: 50,
  },
  {
    id: "food",
    name: "Food",
    basePrice: 2,
  },
  {
    id: "wood",
    name: "Wood",
    basePrice: 2,
  },
  {
    id: "stone",
    name: "Stone",
    basePrice: 4,
  },
  {
    id: "iron",
    name: "Iron",
    basePrice: 8,
  },
];

const Market: React.FC = () => {
  const dispatch = useDispatch();
  const { resources, population } = useSelector(
    (state: RootState) => state.resources
  );
  const { housing } = useSelector((state: RootState) => state.buildings);
  const gold = resources.gold;

  // Calculate Max Population
  const maxPopulation = Object.values(housing).reduce(
    (sum, house) => sum + house.populationCap,
    0
  );

  const getBuyPrice = (basePrice: number) => Math.ceil(basePrice * 1);
  const getSellPrice = (basePrice: number) => Math.floor(basePrice * 0.5);

  const handleTrade = (
    type: "buy" | "sell",
    item: TradeItem,
    amount: number
  ) => {
    const unitPrice =
      type === "buy"
        ? getBuyPrice(item.basePrice)
        : getSellPrice(item.basePrice);
    const cost = unitPrice * amount;
    dispatch(
      tradeResource({
        type,
        resource: item.id as any,
        amount,
        cost,
      })
    );
  };

  const CanAfford = (itemId: string, amount: number) => {
    const item = TRADE_ITEMS.find((i) => i.id === itemId);
    if (!item) return false;

    // Population Cap Check
    if (itemId === "population") {
      if (population + amount > maxPopulation) return false;
    }

    const price = getBuyPrice(item.basePrice) * amount;
    return gold >= price;
  };

  const HasResource = (itemId: string, amount: number) => {
    if (itemId === "population") {
      // Must leave at least 1 population
      return population - amount >= 1;
    }
    // @ts-ignore
    return (resources[itemId] || 0) >= amount;
  };

  return (
    <div className="h-full w-full p-6 flex flex-col overflow-hidden bg-bg-main">
      <div className="flex-1 flex flex-col rounded-xl overflow-hidden shadow-xl border border-border-main bg-bg-panel">
        {/* Top Bar */}
        <div className="flex-none h-24 border-b border-border-main bg-bg-panel flex items-center px-8 justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-accent/20 text-accent">
              <ShoppingBag size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-main">Market Hall</h1>
              <p className="text-sm text-text-secondary">Global Trading Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-bg-main px-6 py-3 rounded-lg border border-border-main">
            <span className="text-text-muted font-medium uppercase text-xs tracking-wider">
              Gold
            </span>
            <div className="flex items-center gap-2">
              <Coins size={24} className="text-accent" />
              <span className="text-3xl font-bold text-text-main">{gold}</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-12">
          {/* SELLING SECTION */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <BadgeDollarSign size={24} className="text-success" />
              <div>
                <h2 className="text-2xl font-bold text-text-main">
                  Sell Resources
                </h2>
                <p className="text-sm text-text-muted mt-1">
                  Exchange goods for Gold
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {TRADE_ITEMS.map((item) => {
                const owned =
                  item.id === "population"
                    ? population
                    : resources[item.id as keyof typeof resources] || 0;
                const sellPrice = getSellPrice(item.basePrice);

                return (
                  <div
                    key={`sell-${item.id}`}
                    className="flex items-center h-20 rounded-lg border border-border-light bg-bg-panel hover:border-border-active transition-colors px-4"
                  >
                    {/* Icon & Name */}
                    <div className="w-1/4 flex items-center gap-4">
                      <div className={`p-2 rounded-full bg-bg-main`}>
                        <ResourceIcon resource={item.id} size={20} />
                      </div>
                      <div>
                        <span className="block font-bold text-text-main">
                          {item.name}
                        </span>
                        <span className="text-xs text-text-muted">
                          Owned: {owned}
                        </span>
                      </div>
                    </div>

                    {/* Price Info */}
                    <div className="flex-1 border-l border-r border-border-main/50 px-4 flex items-center justify-center gap-1">
                      <span className="text-text-secondary text-sm">
                        Sell for
                      </span>
                      <Coins size={14} className="text-accent" />
                      <span className="text-accent font-bold">{sellPrice}</span>
                    </div>

                    {/* Actions */}
                    <div className="w-1/3 flex items-center justify-end gap-2 pl-4">
                      <Button
                        onClick={() => handleTrade("sell", item, 1)}
                        disabled={!HasResource(item.id, 1)}
                        variant="secondary"
                        className="px-4 py-1 text-sm bg-bg-main border border-border-main hover:bg-bg-dark"
                      >
                        Sell 1
                      </Button>
                      <Button
                        onClick={() => handleTrade("sell", item, 10)}
                        disabled={!HasResource(item.id, 10)}
                        variant="outline" // Less screamy than primary
                        className="px-4 py-1 text-sm bg-bg-main border border-border-main hover:bg-bg-dark"
                      >
                        Sell 10
                      </Button>
                      <Button
                        onClick={() => handleTrade("sell", item, 50)}
                        disabled={!HasResource(item.id, 50)}
                        variant="outline"
                        className="px-4 py-1 text-sm bg-bg-main border border-border-main hover:bg-bg-dark"
                      >
                        Sell 50
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* BUYING SECTION */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <ArrowRightLeft size={24} className="text-brand" />
              <div>
                <h2 className="text-2xl font-bold text-text-main">
                  Buy Resources
                </h2>
                <p className="text-sm text-text-muted mt-1">
                  Purchase goods with Gold
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {TRADE_ITEMS.map((item) => {
                const buyPrice = getBuyPrice(item.basePrice);
                return (
                  <div
                    key={`buy-${item.id}`}
                    className="flex items-center h-20 rounded-lg border border-border-light bg-bg-panel hover:border-border-active transition-colors px-4"
                  >
                    {/* Icon & Name */}
                    <div className="w-1/4 flex items-center gap-4">
                      <div className={`p-2 rounded-full bg-bg-main`}>
                        <ResourceIcon resource={item.id} size={20} />
                      </div>
                      <div>
                        <span className="block font-bold text-text-main">
                          {item.name}
                        </span>
                        <span className="text-xs text-text-muted">
                          {item.id === "population"
                            ? `Housing Cap: ${maxPopulation}`
                            : "In Stock: ∞"}
                        </span>
                      </div>
                    </div>

                    {/* Price Info */}
                    <div className="flex-1 border-l border-r border-border-main/50 px-4 flex items-center justify-center gap-1">
                      <span className="text-text-secondary text-sm">
                        Buy for
                      </span>
                      <Coins size={14} className="text-accent" />
                      <span className="text-accent font-bold">{buyPrice}</span>
                    </div>

                    {/* Actions */}
                    <div className="w-1/3 flex items-center justify-end gap-2 pl-4">
                      <Button
                        onClick={() => handleTrade("buy", item, 1)}
                        disabled={!CanAfford(item.id, 1)}
                        variant="secondary"
                        className="px-4 py-1 text-sm bg-bg-main border border-border-main hover:bg-bg-dark"
                      >
                        Buy 1
                      </Button>
                      <Button
                        onClick={() => handleTrade("buy", item, 10)}
                        disabled={!CanAfford(item.id, 10)}
                        variant="outline"
                        className="px-4 py-1 text-sm bg-bg-main border border-border-main hover:bg-bg-dark"
                      >
                        Buy 10
                      </Button>
                      <Button
                        onClick={() => handleTrade("buy", item, 50)}
                        disabled={!CanAfford(item.id, 50)}
                        variant="outline"
                        className="px-4 py-1 text-sm bg-bg-main border border-border-main hover:bg-bg-dark"
                      >
                        Buy 50
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Market;

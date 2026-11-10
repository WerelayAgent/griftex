export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    ok: true,
    token: {
      configured: true,
      symbol: "GRIFTEX",
      ticker: "$GRIFTEX",
      chain: "Solana",
      chainName: "SOLANA NETWORK",
      status: "live now on pump.fun",
      address: "live now on pump.fun"
    }
  });
}

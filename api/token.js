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
      status: "7zbLUnHFKLbPJk6vTWToPoijsKpgmaj8Tbv1Pq57pump",
      address: "7zbLUnHFKLbPJk6vTWToPoijsKpgmaj8Tbv1Pq57pump"
    }
  });
}

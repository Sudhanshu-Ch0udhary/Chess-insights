export async function fetchGame(gameId, token) {
  const res = await fetch(`/api/games/${gameId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch game");
  return res.json();
}

export async function fetchAnalysis(gameId, token) {
  const res = await fetch(`/api/analysis/${gameId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchReview(gameId, token) {
  const res = await fetch(`/api/review/${gameId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return null;
  return res.json();
}

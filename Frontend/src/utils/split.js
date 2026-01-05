function split(participants, appetizerSubtotal = 0, taxRate = 0, tipRate = 0) {
  if (!Array.isArray(participants) || participants.length === 0) {
    throw new Error("participants must be a non-empty array");
  }

  const includedApps = participants.filter(p => p.includeApps);
  const appShare = includedApps.length > 0 ? (appetizerSubtotal / includedApps.length) : 0;

  const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

  const results = participants.map((p) => {
    const meal = Number(p.mealSubtotal) || 0;
    const apps = p.includeApps ? appShare : 0;

    const base = meal + apps;
    const tax = base * taxRate;
    const tip = base * tipRate;

    return {
      name: p.name,
      mealSubtotal: round2(meal),
      appetizerShare: round2(apps),
      preTaxpreTipSubtotal: round2(base),
      tax: round2(tax),
      tip: round2(tip),
      total: round2(base + tax + tip),
    };
  });

  // Fix rounding errors by adjusting the person with the smallest total
  const actualSubtotal = participants.reduce((sum, p) => {
    const meal = Number(p.mealSubtotal) || 0;
    const apps = p.includeApps ? appShare : 0;
    const base = meal + apps;
    return sum + base;
  }, 0);

  const calculatedTotal = actualSubtotal * (1 + taxRate + tipRate);
  const sumOfIndividualTotals = results.reduce((sum, r) => sum + r.total, 0);
  const difference = round2(calculatedTotal - sumOfIndividualTotals);

  if (difference !== 0) {
    // Find the person with the smallest total
    let minIndex = 0;
    let minTotal = results[0].total;
    for (let i = 1; i < results.length; i++) {
      if (results[i].total < minTotal) {
        minTotal = results[i].total;
        minIndex = i;
      }
    }
    // Adjust their total
    results[minIndex].total = round2(results[minIndex].total + difference);
  }

  return results;
}

export default split;

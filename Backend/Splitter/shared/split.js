function split(particpants, tax, tip) {
  const updatedTotal = new Map<string, number>; 
  for (const [person, subTotal] of particpants){
    const newVal = subTotal+(subTotal*tax)+(subTotal*tip)
    updatedTotal.set(person, newVal);
  }
  return updatedTotal; 
}

function split(particpants, items, tax, tip) {
  const updatedTotal: Array<Map<string, number>> = []; 
  for (const [person, subTotal] of particpants){
    const temp = new Map<string, number>(); 
    const newVal = (subTotal*tax)+(subTotal*tip)
    temp.set(person, newVal);
    updatedTotal.push(temp);
  }
  return updatedTotal; 
}

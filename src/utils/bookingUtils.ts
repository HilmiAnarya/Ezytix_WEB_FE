export type PassengerType = "adult" | "child" | "infant";

export const generatePassengerList = (
  adults: number, 
  children: number, 
  infants: number
): PassengerType[] => {
  const list: PassengerType[] = [];
  for (let i = 0; i < adults; i++) list.push("adult");
  for (let i = 0; i < children; i++) list.push("child");
  for (let i = 0; i < infants; i++) list.push("infant");
  
  return list;
};  
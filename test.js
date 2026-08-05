const func1 = () => {
  setTimeout(() => {
    func2();
  }, 0);
  const func2 = () => console.log("func2 works!");
};
func1();

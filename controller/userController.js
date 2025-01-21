exports.register = async (req, res) => {
  const { email, name, password } = req.body;
  try {
    console.log(email, name, password);
    res.json({ email, name, password });
  } catch (error) {
    console.log(error);
  }
};


exports.login = async (req, res)=> {
    const { email, name, password } = req.body;
    try {
        console.log(email, name, password);
        res.json({ email, name, password });
      } catch (error) {
        console.log(error);
      }
}
export const redirectToAdmin = async (req, res) => {
  res.redirect("/admin");
};

export const catch404Admin = (req, res) => {
  if (req.xhr) {
    return res.status(404).json("Not Found");
  }
  res.status(404).render("admin/body/error/404");
};

export const catch500Admin = (err, req, res, next) => {
  console.log(err);

  if (req.xhr) {
    return res.status(500).json({
      message: "Failed",
      payload: err.toString(),
    });
  }

  res.status(500).render("admin/body/error/500");
};

export const catch404Api = (req, res) => {
  res.status(404).json("Not Found");
};

export const catch500Api = (err, req, res, next) => {
  // eslint-disable-line
  // eslint-disable-next-line no-console
  console.log(err);

  res.status(500).json({
    message: "Failed",
    payload: err.toString(),
  });
};

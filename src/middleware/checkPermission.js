const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user || !req.user.permissions) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!req.user.permissions.includes(requiredPermission)) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền truy cập chức năng này!" });
    }

    next();
  };
};

export default checkPermission;

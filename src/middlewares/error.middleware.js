export default function (err, req, res, next) {
  console.error(err);
  res.status(err.status || 500);
  res.json({
    message: err.message,
  });
}

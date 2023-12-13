let base_url = "/api";
if (process.env.NODE_ENV === "test") {
  base_url = "";
}else if (process.env.NODE_ENV === "production") {
  base_url = "";
}
export default base_url;
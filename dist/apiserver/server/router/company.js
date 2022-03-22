const express = require("express");
const db = require("../db");
const { formatData } = require("../utils");
const token = require("../utils/token");

const router = express.Router();
module.exports = router;
function checkAuth(req, res) {
  const { authorization } = req.headers;
  const result = token.verify(authorization);
  if (!result) {
    res.send({ code: 401, msg: "token不存在或已过期" });
    return false;
  } else {
    return true;
  }
}
//企业列表
router.get("/", async (req, res) => {
  const { page = 1, size = 10 } = req.query;
  const idx = (page - 1) * size;
  const qty = Number(size);

  let sql = `select company from category`;
  const total = await db(sql);
  sql = `select company from category  limit ${idx},${qty}`;
  const data = await db(sql);
  res.send({ code: 200, data: data, total: total.length, msg: "success" });
});
//添加企业
router.post("/", async (req, res) => {
  if (!checkAuth(req, res)) {
    return;
  }
  const { company, department, job } = req.body;

  if (!(company && department && job)) {
    res.send({ code: 400, msg: "参数错误" });
    return;
  }
  const sql = `insert into category (company,department,job) values ('${company}','${department}','${job}')`;
  const data = await db(sql);
  if (data.affectedRows > 0) {
    res.send(formatData.success());
  } else {
    res.send(formatData.fail());
  }
});
//单删
router.delete('/:id',async(req,res)=>{
  if (!checkAuth(req, res)) {
    return;
  }
  const {id}=req.params
  const sql=`delete from category where id=${id}`
  const data = await db(sql);
  if (data.affectedRows > 0) {
    res.send(formatData.success());
  } else {
    res.send(formatData.fail());
  }
})

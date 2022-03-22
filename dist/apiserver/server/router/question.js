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
//获取分类列表
router.get("/category", async (req, res) => {
  let sql = `select * from category`;
  let data = await db(sql);

  let datalist = [];

  data.map((item) => {
    const list = {
      id: item.id,
      company: item.company,
      department: JSON.parse(item.department),
      job: JSON.parse(item.job),
    };
    datalist.push(list);
  });

  if (data) {
    res.send(formatData.success(datalist));
  } else {
    res.send(formatData.fail());
  }
});

//题目列表
router.get("/", async (req, res) => {
  const { page = 1, size = 10, company, department, job, sort } = req.query;

  let sql = `select * from question`;

  const idx = (page - 1) * size;
  const qty = Number(size);

  if (company || department || job) {
    sql += ` where`;
  }

  if (company) {
    sql += ` companys like '%${company}%' and`;
  }
  if (department) {
    sql += ` departments like '%${department}%' and`;
  }
  if (job) {
    sql += ` job like '%${job}%' and`;
  }
  if (company || department || job) {
    sql = sql.substring(0, sql.length - 4);
  }

  if (sort) {
    // 0: asc   升序
    // 1: desc  降序
    // 'price','price,0','price,1'
    let [key, type = 0] = sort.split(",");
    sql += ` order by ${key}`;
    if (type == 1) {
      sql += ` desc`;
    }
  }
const number = await db(sql);
const totals = number.length;
 
  sql += ` limit ${idx},${qty}`;

  const data = await db(sql);

  if (data) {
    res.send({ data, total: totals, msg: "success", code: 200 });
  } else {
    res.send(formatData.fail());
  }
});
//获取企业题数
router.get("/sum", async (req, res) => {
  let sql = `select company from category`;
  const companys = await db(sql);
  let comTotal = [];
  companys.map(async (item) => {
    sql = `SELECT COUNT(*) as total from question where companys like '%${item.company}%'`;
    const totals = await db(sql);
    let total = totals[0].total;
    const ctotsl = {
      company: item.company,
      total: total,
    };
    comTotal.push(ctotsl);
    if (comTotal.length == companys.length) {
      res.send(formatData.success(comTotal));
    }
  });
});

//更新star
router.put("/star", async (req, res) => {
  if (!checkAuth(req, res)) {
    return;
  }
  let { qid,star } = req.body;
  try {
    star = JSON.parse(star);
  } catch (error) {}
  if (typeof star != "number") {
    res.send({ code: 400, msg: "参数类型错误" });
    return;
  }
  const sql = `update question set star=${star} where qid=${qid}`;
  const data = await db(sql);
  if (data.affectedRows > 0) {
    res.send(formatData.success());
  } else {
    res.send(formatData.fail());
  }
});

//搜索题目
router.get("/search", async (req, res) => {
  const { page = 1, size = 10, keyword } = req.query;
  const idx = (page - 1) * size;
  const qty = Number(size);

  let sql = `select * from question where title LIKE '%${keyword}%'`;
  const datas = await db(sql);

  sql = `select * from question where title LIKE '%${keyword}%' limit ${idx},${qty}`;
  const data = await db(sql);

  let datalist = [];

  data.map((item) => {
    let company;
    let department;
    let job;

    if (item.companys !== null) {
      company = JSON.parse(item.companys);
    }

    if (item.departments !== null) {
      department = JSON.parse(item.departments);
    }
    if (item.job !== null) {
      job = JSON.parse(item.job);
    }

    const list = {
      id: item.id,
      qid: item.qid,
      title: item.title,
      level: item.level,
      company,
      department,
      job,
      slug_title: item.slug_title,
      time: item.time,
      addtime: item.addtime,
    };
    datalist.push(list);
  });

  if (data) {
    res.send({
      code: 200,
      msg: "success",
      data: datalist,
      total: datas.length,
    });
  } else {
    res.send(formatData.fail());
  }
});
//添加题目
router.post("/add", async (req, res) => {
  if (!checkAuth(req, res)) {
    return;
  }
  let { title, level = 1, company, department, job } = req.body;
  try {
    level = JSON.parse(level);
  } catch (error) {}

  if (typeof level != "number") {
    res.send({ code: 400, msg: "参数错误" });
    return;
  }
  if (title && company && department && job) {
    const qid = parseInt(Math.random() * 10000);
    company = `["${company}"]`;
    department = `["${department}"]`;
    job = `["${job}"]`;

    const date = new Date().toLocaleDateString();

    const sql = `insert into question (qid,title,level,companys,departments,job,time) values (${qid},'${title}',${level},'${company}','${department}','${job}','${date}')`;
    const reslut = await db(sql);

    if (reslut.affectedRows == 1) {
      res.send(formatData.success());
    } else {
      res.send(formatData.fail());
    }
  } else {
    res.send({ code: 400, msg: "参数错误" });
  }
});

// 删除题目
router.delete("/", async (req, res) => {
  if (!checkAuth(req, res)) {
    return;
  }
  let { id } = req.body;

  let sql = "delete from question where qid in (";

  id = JSON.parse(id);

  if (Array.isArray(id)) {
    id.forEach((item) => {
      sql += item + ",";
    });
    sql = sql.slice(0, sql.length - 1) + ")";
  } else {
    sql = `delete from question where qid='${id}'`;
  }

  const data = await db(sql);

  if (data.affectedRows > 0) {
    res.send(formatData.success());
  } else {
    res.send(formatData.fail());
  }
});
//编辑题目
router.put("/:id", async (req, res) => {
  if (!checkAuth(req, res)) {
    return;
  }
  const { id } = req.params;
  let { title, company, department, job, level, hot } = req.body;

  if (!(title || company || department || job || level || hot)) {
    res.send({ code: 400, msg: "无参数" });
    return;
  }

  try {
    company = JSON.parse(company);
    department = JSON.parse(department);
    job = JSON.parse(job);
    level = JSON.parse(level);
    hot = JSON.parse(hot);
  } catch (error) {}
  if (level || hot) {
    if (typeof level != "number" || typeof hot != "number") {
      res.send({ code: 400, msg: "参数错误" });
      return;
    }
  }

  let sql = `update question set `;

  if (title) {
    sql += `title='${title}',`;
  }

  if (company) {
    if (Array.isArray(company)) {
      company = JSON.stringify(company);
      sql += `companys='${company}',`;
    } else {
      res.send({ code: 400, msg: "参数应为数组" });
      return;
    }
  }

  if (department) {
    if (Array.isArray(department)) {
      department = JSON.stringify(department);
      sql += `departments='${department}',`;
    } else {
      res.send({ code: 400, msg: "参数应为数组" });
      return;
    }
  }

  if (job) {
    if (Array.isArray(job)) {
      job = JSON.stringify(job);
      sql += `job='${job}',`;
    } else {
      res.send({ code: 400, msg: "参数应为数组" });
      return;
    }
  }

  if (level) {
    sql += `level='${level}',`;
  }
  if (hot) {
    sql += `hot='${hot}',`;
  }
  sql = sql.substring(0, sql.length - 1);
  sql += ` where qid='${id}'`;

  const data = await db(sql);
  if (data.affectedRows > 0) {
    res.send(formatData.success());
  } else {
    res.send(formatData.fail());
  }
});
//获取单个题目信息
router.get("/:qid", async (req, res) => {
  const { qid } = req.params;
  if (!qid) {
    res.send(formatData.fail());
    return
  }

  const sql = `select * from question where qid=${qid}`;
  const data = await db(sql);

  let result = data[0];

  if (result.companys != null) {
    result.companys = JSON.parse(result.companys);
  }

  if (result.departments != null) {
    result.departments = JSON.parse(result.departments);
  }

  if (result.job != null) {
    result.job = JSON.parse(result.job);
  }

  if (data) {
    res.send(formatData.success(result));
  } else {
    res.send(formatData.fail());
  }
});

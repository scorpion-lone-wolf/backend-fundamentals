const getData = db => {
  return new Promise((resolve, reject) => {
    // setTimeout(() => { // This simulate IO heavy task i.e CPU is ideal
    try {
      const row = db.prepare("SELECT message FROM messages WHERE id = 1").get();
      resolve({ data: row ? row.message : "No message found" });
    } catch (err) {
      reject(err);
    }
    // }, 3000);
  });
};

module.exports = { getData };

#### Techiniques to identify and Optimize the performance of an SQL query :-

1. `EXPLAIN` the query :
   ```SQL
   EXPLAIN SELECT * FROM actor WHERE first_name='Will";
   ```
2. Avoid SELECT \* to reduce I/O and network load.
3. Levrage Caching :
   - To use External caching system like Redis

---

#### Question : Why not create indexes for all the field if it increase Performace?

- Indexes speed up reads operation but slow down writes operation , since each write must update both the table and its associated index table.

---

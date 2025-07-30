import React, { useEffect, useState } from "react";

export function Food() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("apple");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFoodId, setSelectedFoodId] = useState(null);
  const [foodDetail, setFoodDetail] = useState(null);

  const pageSize = 10;
  const API_KEY = "VsNxcVGrt9triez7CjKKNwKdjRidilAez1CFdvLk";

  // 获取列表数据
  useEffect(() => {
    if (selectedFoodId) return;
    setLoading(true);
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&pageSize=${pageSize}&pageNumber=${page}&api_key=${API_KEY}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setFoods(data.foods || []);
        setTotalPages(Math.ceil((data.totalHits || 1) / pageSize));
        setLoading(false);
      })
      .catch((err) => {
        console.error("获取列表失败:", err);
        setLoading(false);
      });
  }, [query, page, selectedFoodId]);

  // 获取详情数据
  useEffect(() => {
    if (!selectedFoodId) return;
    setLoading(true);
    const url = `https://api.nal.usda.gov/fdc/v1/${selectedFoodId}?api_key=${API_KEY}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log("详情数据：", data);
        setFoodDetail(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("获取详情失败:", err);
        setLoading(false);
      });
  }, [selectedFoodId]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSelectedFoodId(null); // 回到列表
  };

  const handleBack = () => {
    setSelectedFoodId(null);
    setFoodDetail(null);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>USDA 食物数据库</h1>

      {/* 搜索框，仅在列表页显示 */}
      {!selectedFoodId && (
        <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="请输入食物关键词（如 apple）"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ padding: "5px", width: "200px" }}
          />
          <button type="submit" style={{ marginLeft: "10px" }}>搜索</button>
        </form>
      )}

      {/* 加载状态 */}
      {loading && <p>加载中...</p>}

      {/* 详情页 */}
      {!loading && selectedFoodId && foodDetail && (
        <div>
          <h2>{foodDetail.description}</h2>
          <p><strong>分类：</strong>{foodDetail.foodCategory || "未知"}</p>
          <p><strong>发布日期：</strong>{foodDetail.publicationDate || "未知"}</p>

          <h3>营养成分（前 20 项）</h3>
          {foodDetail.foodNutrients && foodDetail.foodNutrients.length > 0 ? (
            <ul>
              {foodDetail.foodNutrients.slice(0, 20).map((nutrient, index) => (
                <li key={index}>
                  {nutrient.nutrientName || "未知"}：{nutrient.value ?? 0} {nutrient.unitName || ""}
                </li>
              ))}
            </ul>
          ) : (
            <p>暂无营养成分数据。</p>
          )}

          <button onClick={handleBack} style={{ marginTop: "20px" }}>← 返回列表</button>
        </div>
      )}

      {/* 列表页 */}
      {!loading && !selectedFoodId && (
        <div>
          <ul>
            {foods.map((item) => (
              <li key={item.fdcId} style={{ marginBottom: "10px" }}>
                <button
                  onClick={() => setSelectedFoodId(item.fdcId)}
                  style={{ fontSize: "16px", cursor: "pointer" }}
                >
                  {item.description}
                </button>
                <br />
                分类：{item.foodCategory || "未知"}
              </li>
            ))}
          </ul>

          {/* 分页按钮 */}
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              style={{ marginRight: "10px" }}
            >
              上一页
            </button>
            <span>第 {page} 页 / 共 {totalPages} 页</span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              style={{ marginLeft: "10px" }}
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
  );
}


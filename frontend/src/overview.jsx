import { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Component สำหรับ Gradient Legend (แถบไล่สี)
function GradientLegendControl() {
  const map = useMap();
  
  useEffect(() => {
    const gradientLegend = L.control({ position: 'bottomleft' });
    
    gradientLegend.onAdd = function () {
      const div = L.DomUtil.create('div', 'gradient-legend');
      div.innerHTML = `
        <div style="
          padding: 8px;
          font-family: Arial, sans-serif;
          font-size: 11px;
        ">
          <div style="
            width: 250px;
            height: 15px; 
            background: linear-gradient(to right, #E0E0E0, #FED976, #FD8D3C, #FC4E2A, #E31A1C, #BD0026, #800026);
            border: 1px solid rgba(255,255,255,0.8);
            border-radius: 3px;
            margin-bottom: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.4);
          "></div>
          <div style="
            display: flex; 
            justify-content: space-between; 
            width: 250px;
            color: white;
            text-shadow: 1px 1px 1px rgba(0,0,0,0.7);
            font-weight: bold;
            font-size: 10px;
          ">
            <span>0</span>
            <span>500</span>
            <span>1K</span>
            <span>2K</span>
            <span>3K</span>
            <span>4K+</span>
          </div>
        </div>
      `;
      return div;
    };
    
    gradientLegend.addTo(map);
    
    return () => {
      gradientLegend.remove();
    };
  }, [map]);
  
  return null;
}

// Component สำหรับแสดงกราฟเส้นแบบง่าย
function MiniLineChart({ data, color = "#3B82F6" }) {
  const width = 60;
  const height = 20;
  const max = Math.max(...data);
  const min = Math.min(...data);
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / (max - min)) * height;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width={width} height={height} className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function Overview() {
  const [geoData, setGeoData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Mock data จำลองจำนวนผู้ใช้ต่อประเทศ พร้อม requests และ bandwidth
  const userData = {
    Thailand: {
      users: 1500,
      requests: 12500,
      requestsChart: [8, 12, 15, 18, 22, 25, 20],
      bandwidth: 850,
      bandwidthChart: [5, 8, 12, 15, 18, 17, 14]
    },
    Japan: {
      users: 900,
      requests: 8200,
      requestsChart: [6, 9, 12, 8, 11, 14, 12],
      bandwidth: 620,
      bandwidthChart: [4, 7, 9, 6, 8, 10, 9]
    },
    India: {
      users: 2200,
      requests: 18600,
      requestsChart: [10, 14, 18, 22, 28, 32, 30],
      bandwidth: 1250,
      bandwidthChart: [8, 12, 16, 20, 24, 22, 20]
    },
    China: {
      users: 3000,
      requests: 24800,
      requestsChart: [15, 20, 25, 30, 35, 40, 38],
      bandwidth: 1680,
      bandwidthChart: [12, 16, 20, 25, 28, 30, 28]
    },
    "United States": {
      users: 4500,
      requests: 38200,
      requestsChart: [25, 30, 35, 40, 45, 50, 48],
      bandwidth: 2850,
      bandwidthChart: [20, 25, 30, 35, 40, 42, 40]
    },
    Brazil: {
      users: 800,
      requests: 6800,
      requestsChart: [4, 6, 8, 7, 9, 11, 10],
      bandwidth: 480,
      bandwidthChart: [3, 5, 6, 5, 7, 8, 7]
    },
    Australia: {
      users: 600,
      requests: 4200,
      requestsChart: [3, 4, 5, 6, 5, 7, 6],
      bandwidth: 320,
      bandwidthChart: [2, 3, 4, 4, 3, 5, 4]
    },
    Germany: {
      users: 1600,
      requests: 13800,
      requestsChart: [8, 12, 16, 14, 18, 22, 20],
      bandwidth: 920,
      bandwidthChart: [6, 9, 12, 10, 14, 16, 14]
    },
    Canada: {
      users: 1000,
      requests: 9200,
      requestsChart: [5, 8, 10, 9, 12, 15, 13],
      bandwidth: 680,
      bandwidthChart: [4, 6, 8, 7, 9, 11, 10]
    },
  };

  // โหลด GeoJSON
  useEffect(() => {
    fetch("/world_countries.geojson")
      .then((res) => res.json())
      .then((data) => {
        console.log("Sample feature properties:", data.features[0]?.properties);
        setGeoData(data);
      })
      .catch((err) => console.error("Failed to load GeoJSON:", err));
  }, []);

  // ฟังก์ชันกำหนดสีตามจำนวนผู้ใช้งาน
  const getColor = (value) => {
    return value > 4000
      ? "#800026"
      : value > 3000
      ? "#BD0026"
      : value > 2000
      ? "#E31A1C"
      : value > 1000
      ? "#FC4E2A"
      : value > 500
      ? "#FD8D3C"
      : value > 0
      ? "#FED976"
      : "#E0E0E0";
  };

  // แปลงชื่อประเทศใน GeoJSON ให้ตรงกับ userData
  const countryNameMapping = {
    "United States of America": "United States",
  };

  // ฟังก์ชันหาชื่อประเทศที่ถูกต้อง
  const getCountryName = (feature) => {
    const props = feature.properties;
    console.log("Feature properties:", props);
    
    let countryName = props.ADMIN || props.NAME || props.NAME_EN || props.COUNTRY || props.name;
    
    if (countryNameMapping[countryName]) {
      countryName = countryNameMapping[countryName];
    }
    
    console.log("Final country name:", countryName, "Users:", userData[countryName]?.users || 0);
    return countryName;
  };

  // กำหนด style ของแต่ละประเทศ
  const style = (feature) => {
    const countryName = getCountryName(feature);
    const users = userData[countryName]?.users || 0;
    
    return {
      fillColor: getColor(users),
      weight: selectedCountry?.countryName === countryName ? 3 : 1,
      opacity: 1,
      color: selectedCountry?.countryName === countryName ? "#000" : "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  };

  // แสดง popup และจัดการการคลิก
  const onEachFeature = (feature, layer) => {
    const countryName = getCountryName(feature);
    const data = userData[countryName];

    if (data) {
      layer.bindPopup(`
        <div style="font-family: Arial, sans-serif;">
          <strong>${countryName}</strong><br/>
          ผู้ใช้งาน: ${data.users.toLocaleString()} คน<br/>
          Requests: ${data.requests.toLocaleString()}<br/>
          Bandwidth: ${data.bandwidth} MB
        </div>
      `);
      
      layer.on('click', () => {
        setSelectedCountry({
          countryName: countryName,
          ...data
        });
      });
    }
  };

  // เรียงลำดับประเทศตาม requests จากมากไปน้อย
  const sortedCountries = Object.entries(userData)
    .sort(([,a], [,b]) => b.requests - a.requests)
    .map(([country, data]) => ({ country, ...data }));

  return (
    <div className="w-full flex"> 
      {/* แผนที่ */}
      <div style={{ height: "70vh", width: "50%" }}>
        <MapContainer 
          center={[20, 0]} 
          zoom={2} 
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {geoData && (
            <GeoJSON 
              data={geoData} 
              style={style} 
              onEachFeature={onEachFeature}
            />
          )}
          
          {/* แสดงแถบไล่สี */}
          <GradientLegendControl />
        </MapContainer>
      </div>

      {/* ตารางรายงานประเทศ */}
      <div style={{ height: "70vh", width: "50%" }} className="bg-gray-50 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <h2 className="text-lg font-semibold text-gray-800">Country Reports</h2>
          </div>
          
          {/* Table Header */}
          <div className="bg-gray-100 border-b border-gray-200">
            <div className="grid grid-cols-4 gap-4 px-4 py-2 text-sm font-medium text-gray-600">
              <div>ชื่อประเทศ</div>
              <div className="text-center">Requests</div>
              <div className="text-center">่่jjj</div>
              <div className="text-center">Bandwidth</div>
            </div>
          </div>
          
          {/* Table Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {sortedCountries.map((countryData, index) => (
              <div 
                key={countryData.country}
                className={`grid grid-cols-4 gap-4 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors
                  ${selectedCountry?.countryName === countryData.country ? 'bg-blue-50 border-blue-200' : ''}
                `}
                onClick={() => setSelectedCountry({
                  countryName: countryData.country,
                  ...countryData
                })}
              >
                {/* ชื่อประเทศ */}
                <div className="flex items-center">
                  <div className="text-sm font-medium text-gray-900">
                    {countryData.country}
                  </div>
                </div>
                
                {/* Requests */}
                <div className="text-center">
                  <div className="text-sm text-gray-900 font-medium">
                    {countryData.requests.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">requests</div>
                </div>
                
                {/* กราฟเส้น Requests */}
                <div className="flex justify-center items-center">
                  <MiniLineChart 
                    data={countryData.requestsChart} 
                    color="#3B82F6"
                  />
                </div>
                
                {/* Bandwidth */}
                <div className="text-center">
                  <div className="text-sm text-gray-900 font-medium">
                    {countryData.bandwidth} MB
                  </div>
                  <div className="flex justify-center items-center mt-1">
                    <MiniLineChart 
                      data={countryData.bandwidthChart} 
                      color="#10B981"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
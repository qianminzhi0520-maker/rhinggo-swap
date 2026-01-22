import { useEffect, useState } from 'react';

export default function Home() {
  const [stations, setStations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  // 获取用户位置
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation({ lat, lng });
      }, (error) => {
        console.error("Error getting location:", error);
      });
    }
  }, []);

  // 计算两点间距离（单位：公里）
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 地球半径，单位：公里
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  // 根据距离排序站点
  const sortStationsByDistance = (stations, userLocation) => {
    return stations.sort((a, b) => {
      const distA = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        a.lat,
        a.lng
      );
      const distB = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        b.lat,
        b.lng
      );
      return distA - distB;
    });
  };

  // 每 30 秒刷新数据
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await fetch('/api/stations');
        const data = await res.json();
        if (userLocation) {
          setStations(sortStationsByDistance(data, userLocation));
        } else {
          setStations(data);
        }
      } catch (err) {
        console.error('Failed to fetch stations:', err);
      }
    };

    fetchStations();

    const interval = setInterval(fetchStations, 30000); // 每 30 秒刷新一次

    return () => clearInterval(interval);
  }, [userLocation]);

  return (
    <div>
      <h1>Rhinggo Navi Swap Station</h1>
      <ul>
        {stations.map((station) => (
          <li key={station.name}>
            {station.name} - {station.battery_available}/{station.battery_total}
          </li>
        ))}
      </ul>
    </div>
  );
}
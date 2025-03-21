<template>
  <div class="location-map">
    <div class="location-map-header">
      <AButton size="large" type="text" shape="round" class="location-map-header-button" @click="goBack">
        <template #icon>
          <LeftOutlined/>
        </template>
        返回
      </AButton>
    </div>

    <div class="location-map-container" id="location-map-container">

    </div>
  </div>
</template>

<script setup lang="ts">
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useStore from "@/store";

import {getCoordinateListApi} from "@/api/storage";

const userStore = useStore().user;
const router = useRouter();

const customIcon = L.icon({
  iconUrl: userStore.user.avatar,

  iconSize: [38, 95], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62],  // the same for the shadow
  popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

async function initMap() {
  const map = L.map('location-map-container', {
    attributionControl: false,
    center: [34.3237, 108.5525],
  }).setView([34.3237, 108.5525], 13);

  L.tileLayer('https://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}', {
    maxZoom: 8,
  }).addTo(map);
  const res: any = await getCoordinateListApi();
  if (res && res.code === 200) {
    const list: any[] = res.data.records;
    for (const item of list) {
      L.marker([item.latitude, item.longitude], {icon: customIcon}).addTo(map)
          .bindPopup(`<h3 style="text-align: center;">
            ${item.country} ${item.province} ${item.city}
            <br>
             <a href="${'/main/album/location' + `/${item.id}` + `?name=${item.city}`}">
            ${item.image_count}张照片
            </a>
            <br>
            <span style="color: #999;font-size: 12px;">点击查看</span>
            </h3>`
          )
          .openPopup();
    }
  }
}

function goBack() {
  return router.go(-1);
}


onMounted(() => {
  initMap();
});

</script>

<style scoped lang="scss">

.location-map {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  gap: 10px;
  position: relative;

  .location-map-header {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    border-bottom: 1px solid #e2e2e2;

    .location-map-header-button {
      font-size: 20px;
      color: rgb(59, 117, 255);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
    }
  }

  .location-map-container {
    width: 100%;
    height: calc(100% - 55px);
  }
}
</style>

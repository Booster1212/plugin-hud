<template>
    <div class="hud">
        <div class="hud-item">
            <div class="hud-label"><Icon icon="icon-trench-body-armor" :size="24"></Icon></div>
            <div class="hud-progress">
                <div class="hud-progress-inner" :style="{ width: armorPercentage + '%' }"></div>
            </div>
        </div>

        <div class="hud-item" v-if="HUDConfig.useFoodPlugin">
            <div class="hud-label"><Icon icon="icon-sliced-bread" :size="24"></Icon></div>
            <div class="hud-progress">
                <div class="hud-progress-inner" :style="{ width: foodPercentage + '%' }"></div>
            </div>
        </div>

        <div class="hud-item" v-if="HUDConfig.useFoodPlugin">
            <div class="hud-label"><Icon icon="icon-soda-bottle" :size="24"></Icon></div>
            <div class="hud-progress">
                <div class="hud-progress-inner" :style="{ width: thirstPercentage + '%' }"></div>
            </div>
        </div>

        <div class="hud-item" v-if="HUDConfig.useFuelPlugin && isInVehicle">
            <div class="hud-label"><Icon icon="icon-local_gas_station" :size="24"></Icon></div>
            <div class="hud-progress">
                <div class="hud-progress-inner" :style="{ width: vehicleFuel + '%' }"></div>
            </div>
        </div>

        <div class="hud-item">
            <div class="hud-label"><Icon icon="icon-bank" :size="24" /></div>
            <div class="hud-value">{{ formatNumberWithThousandsSeparator(bankBalance) }}$</div>
        </div>

        <div class="hud-item">
            <div class="hud-label"><Icon icon="icon-cash" :size="24" /></div>
            <div class="hud-value">{{ formatNumberWithThousandsSeparator(cashBalance) }}$</div>
        </div>

        <div class="hud-item">
            <div class="hud-label"><Icon icon="icon-world" :size="24" /></div>
            <div class="hud-value">{{ dimension }}</div>
        </div>

        <div class="hud-item">
            <div class="hud-label"><Icon icon="icon-clock" :size="24"></Icon></div>
            <div class="hud-value">{{ currentTime }} | {{ currentPlayTime }}h</div>
        </div>

        <div class="hud-item">
            <div class="hud-label"><Icon icon="icon-speed" :size="24"></Icon></div>
            <div class="hud-value">{{ speed }} km/h</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import WebViewEvents from '@utility/webViewEvents';
import { HUD_EVENTS } from '../shared/events.js';
import { HUDConfig } from '../shared/config';
import Icon from '@/components/Icon.vue';
import { Character } from '@AthenaShared/interfaces/character';
import { OwnedVehicle } from '@AthenaShared/interfaces/vehicleOwned';

let armorPercentage = ref(100);
let foodPercentage = ref(75);
let thirstPercentage = ref(50);
let vehicleFuel = ref(0);

let bankBalance = ref(0);
let cashBalance = ref(0);
let dimension = ref(0);
let speed = ref('0');
let currentTime = ref('');
let currentPlayTime = ref('0');

let isInVehicle = ref(false);

onMounted(() => {
    updateTime();
    setInterval(updateTime, 1000);

    WebViewEvents.emitServer(HUD_EVENTS.REQUEST_DATA, updateData);
});

WebViewEvents.on(HUD_EVENTS.UPDATE_HUD, updateData);
WebViewEvents.on(HUD_EVENTS.UPDATE_VEHICLE, updateVehicleData);
WebViewEvents.on(HUD_EVENTS.UPDATE_SPEED, updateSpeed);

function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    currentTime.value = `${hours}:${minutes}:${seconds}`;
}

function updateData(data: Character) {
    armorPercentage.value = data.armour;
    foodPercentage.value = data.food;
    thirstPercentage.value = data.water;

    bankBalance.value = data.bank;
    cashBalance.value = data.cash;
    dimension.value = data.dimension;

    currentPlayTime.value = data.hours.toFixed(2);
}

function updateVehicleData(veh: OwnedVehicle, remove: boolean) {
    if (remove) {
        isInVehicle.value = false;
    } else {
        isInVehicle.value = true;
        vehicleFuel.value = veh.fuel;
    }
}

function updateSpeed(speedClient: string) {
    speed.value = speedClient;
}

function formatNumberWithThousandsSeparator(number: number) {
    if (typeof number !== 'number' || isNaN(number)) {
        return 'Invalid Number';
    }

    const numberString = number.toString();
    const parts = numberString.split('.');
    const wholePart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const formattedNumber = parts.length === 2 ? wholePart + '.' + parts[1] : wholePart;

    return formattedNumber;
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');

.hud {
    position: fixed;
    top: 50px; /* Adjust the top value as needed */
    right: 10px; /* Adjust the right value as needed */
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 10px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    width: 250px;
}

.hud-item {
    display: flex;
    justify-content: space-between;
    margin: 5px 0;

    padding: 5px;
}

.hud-label {
    font-weight: bold;
    font-family: 'Inter';
}

.hud-value {
    font-size: 20px;
}

.hud-progress {
    width: 200px;
    background-color: #ccc;
    height: 20px;
    margin-top: 2px;
}

.hud-progress-inner {
    background-color: #265a96; /* Green color for progress */
    height: 100%;
    transition: width 0.3s; /* Add a smooth transition effect for width changes */
    text-align: center;
}
</style>

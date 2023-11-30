import * as alt from 'alt-client';
import * as native from 'natives';

import * as AthenaClient from '@AthenaClient/api/index.js';
import { onTicksStart } from '@AthenaClient/events/onTicksStart.js';
import { HUD_EVENTS } from '../shared/events.js';

const isMetric = native.getProfileSetting(227);
let speedCalc: string;

function init() {
    AthenaClient.webview.registerOverlay('HUD');
}

onTicksStart.add(init);

alt.everyTick(() => {
    if (!alt.Player.local.vehicle) return;
    const currentSpeed = native.getEntitySpeed(alt.Player.local.vehicle);

    speedCalc = (currentSpeed * (isMetric ? 3.6 : 2.236936)).toFixed(0);
    AthenaClient.webview.emit(HUD_EVENTS.UPDATE_SPEED, speedCalc);
});

alt.on('keyup', (key: number) => {
    AthenaClient.webview.setOverlayVisible('HUD', true);
});

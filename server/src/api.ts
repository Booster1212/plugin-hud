import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';

import { HUDController } from './controller.js';

const HUDFunctions = {
    updateHUD,
    updateVehicleHUD,
};

function updateHUD(player: alt.Player) {
    return HUDController.updateHUD(player);
}

function updateVehicleHUD(player: alt.Player, veh: alt.Vehicle, remove: boolean) {
    return HUDController.updateVehicleHUD(player, veh, remove);
}

Athena.systems.plugins.addAPI('HUD', HUDFunctions);

declare global {
    export interface ServerPluginAPI {
        ['HUD-API']: typeof HUDFunctions;
    }
}

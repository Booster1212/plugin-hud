import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { HUD_EVENTS } from '@AthenaPlugins/plugin-hud/shared/events.js';

export class HUDController {
    static updateHUD(player: alt.Player) {
        try {
            const data = Athena.document.character.get(player);
            Athena.webview.emit(player, HUD_EVENTS.UPDATE_HUD, data);
        } catch (error) {
            alt.logWarning(`Error while updating HUD: ${error}!`);
        }
    }

    static updateVehicleHUD(player: alt.Player, vehicle: alt.Vehicle, remove = true) {
        try {
            const data = Athena.document.vehicle.get(vehicle);
            Athena.webview.emit(player, HUD_EVENTS.UPDATE_VEHICLE, data, remove);
        } catch (error) {
            alt.logWarning(`Error while updating HUD: ${error}!`);
        }
    }
}

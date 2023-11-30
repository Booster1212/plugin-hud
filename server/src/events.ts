import * as Athena from '@AthenaServer/api/index.js';
import * as alt from 'alt-server';

import { HUDConfig } from '@AthenaPlugins/plugin-hud/shared/config.js';
import { HUDController } from './controller.js';
import { HUD_EVENTS } from '@AthenaPlugins/plugin-hud/shared/events.js';

alt.onClient(HUD_EVENTS.REQUEST_DATA, (player: alt.Player) => {
    HUDController.updateHUD(player);

    if (player.vehicle) {
        HUDController.updateVehicleHUD(player, player.vehicle, false);
    }
});

Athena.document.character.onChange('armour', (player: alt.Player, _value: number, _oldValue: number) => {
    HUDController.updateHUD(player);
});

Athena.document.character.onChange('cash', (player: alt.Player, _value: number, _oldValue: number) => {
    HUDController.updateHUD(player);
});

Athena.document.character.onChange('bank', (player: alt.Player, _value: number, _oldValue: number) => {
    HUDController.updateHUD(player);
});

Athena.document.character.onChange('dimension', (player: alt.Player, _value: number, _oldValue: number) => {
    HUDController.updateHUD(player);
});

//* <-- OTHER PLUGIN INTEGRATION --> *//
if (HUDConfig.useFoodPlugin) {
    Athena.document.character.onChange('food', (player: alt.Player, _value: number, _oldValue: number) => {
        HUDController.updateHUD(player);
    });

    Athena.document.character.onChange('water', (player: alt.Player, _value: number, _oldValue: number) => {
        HUDController.updateHUD(player);
    });
}

if (HUDConfig.useFuelPlugin) {
    alt.on('playerLeftVehicle', (player: alt.Player, veh: alt.Vehicle, seat: number) => {
        HUDController.updateVehicleHUD(player, veh, true);
    });

    Athena.player.events.on('player-entered-vehicle-as-driver', (player: alt.Player, veh: alt.Vehicle) => {
        HUDController.updateVehicleHUD(player, veh, false);
    });

    Athena.document.vehicle.onChange('fuel', (vehicle: alt.Vehicle, _value: number, _oldValue: number) => {
        const vehData = Athena.document.vehicle.get(vehicle);
        const player = Athena.getters.player.byDatabaseID(vehData.owner.toString());
        if (!player) {
            alt.logWarning(`Couldn't find player with ID: ${vehData.owner}!`);
        } else if (player?.vehicle) {
            HUDController.updateVehicleHUD(player, vehicle, false);
        }
    });
}

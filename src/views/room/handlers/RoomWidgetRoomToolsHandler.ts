import { NitroEvent, RoomZoomEvent } from 'nitro-renderer';
import { GetRoomEngine } from '../../../api';
import { RoomWidgetUpdateEvent } from '../events';
import { RoomWidgetMessage, RoomWidgetZoomToggleMessage } from '../messages';
import { RoomWidgetHandler } from './RoomWidgetHandler';

export class RoomWidgetRoomToolsHandler extends RoomWidgetHandler
{
    public processEvent(event: NitroEvent): void
    {}

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(message instanceof RoomWidgetZoomToggleMessage)
        {
            GetRoomEngine().events.dispatchEvent(new RoomZoomEvent(GetRoomEngine().activeRoomId, message.zoomedIn ? 0 : 1, false));
        }

        return null;
    }

    public get eventTypes(): string[]
    {
        return [];
    }

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetZoomToggleMessage.ZOOM_TOGGLE
        ];
    }
}

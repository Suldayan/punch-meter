import { useEffect, useState, useCallback } from "react";

interface FetchRoomCodeResult {
    roomCode: string | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useFetchRoomCode(roomName: string = "Game Room"): FetchRoomCodeResult {
    const [roomCode, setRoomCode] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const generateDeviceId = () => {
        return 'host-' + Math.random().toString(36).substr(2, 9);
    };

    const fetchRoomCode = useCallback(() => {
        const fetchViaRest = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch('/api/rooms/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        roomName: roomName,
                        deviceId: generateDeviceId()
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`Failed to create room: ${response.status} ${response.statusText}`);
                }
                
                const data = await response.json();
                setRoomCode(data.roomCode);
                
            } catch (err: any) {
                setError(err.message || 'An error occurred while creating room');
                setRoomCode(null);
            } finally {
                setLoading(false);
            }
        };

        fetchViaRest();
    }, [roomName]);

    useEffect(() => {
        fetchRoomCode();
    }, [fetchRoomCode]);

    return {
        roomCode,
        loading,
        error,
        refetch: fetchRoomCode
    };
}
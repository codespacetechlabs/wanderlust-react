export const tools = [
    {
        type: "function",
        function: {
            name: "update_map",
            description: "Update map to center on a particular location",
            parameters: {
                type: "object",
                properties: {
                    longitude: {
                        type: "number",
                        description: "Longitude of the location to center the map on",
                    },
                    latitude: {
                        type: "number",
                        description: "Latitude of the location to center the map on",
                    },
                    zoom: {
                        type: "integer",
                        description: "Zoom level of the map",
                    },
                },
                required: ["longitude", "latitude", "zoom"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "add_marker",
            description: "Add marker to the map",
            parameters: {
                type: "object",
                properties: {
                    longitude: {
                        type: "number",
                        description: "Longitude of the location to the marker",
                    },
                    latitude: {
                        type: "number",
                        description: "Latitude of the location to the marker",
                    },
                    label: {
                        type: "string",
                        description: "Text to display on the marker",
                    },
                },
                required: ["longitude", "latitude", "label"],
            },
        },
    },
];
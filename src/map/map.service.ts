import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { Captain } from 'src/captain/capschema/captain.schema';


@Injectable()
export class MapService {
    private readonly orsToken = process.env.ORS_API_KEY;
    private readonly baseUrl = 'https://api.openrouteservice.org';

    constructor(@InjectModel(Captain.name) private readonly captainModel: Model<Captain>) { }

    // Get coordinates (lat/lng) for a given address 
    async getAddressCoordinate(address: string) {
        if (!address) throw new BadRequestException('Address is required');

        const url = `${this.baseUrl}/geocode/search?api_key=${this.orsToken}&text=${encodeURIComponent(address)}&size=1`;

        try {
            const response = await axios.get(url);
            const features = response.data.features;

            if (features && features.length > 0) {
                const [lng, ltd] = features[0].geometry.coordinates;
            //    console.log(lng, ltd);
                return { ltd, lng };
            } else {
                throw new BadRequestException('Unable to fetch coordinates');
            }
        } catch (err) {
            console.error(err);
            throw new BadRequestException('Failed to fetch coordinates from ORS');
        }
    }

    // Get distance & duration between two addresses 
    async getDistanceTime(origin: string, destination: string) {
        if (!origin || !destination)
            throw new BadRequestException('Origin and destination are required');

        try {
            const originCoords = await this.getAddressCoordinate(origin);
            const destinationCoords = await this.getAddressCoordinate(destination);
            const url = `${this.baseUrl}/v2/directions/driving-car?api_key=${this.orsToken}`;

            const response = await axios.post(url, {
                coordinates: [
                    [originCoords.lng, originCoords.ltd],
                    [destinationCoords.lng, destinationCoords.ltd],
                ],
            });

            const route = response.data.routes?.[0];
            if (!route) throw new BadRequestException('No route found');

            return {
                distance: { value: route.summary.distance }, // meters ma hoga distance
                duration: { value: route.summary.duration }, // seconds ma hoga duration
            };
        } catch (err) {
            console.error(err);
            throw new BadRequestException('Failed to fetch distance/time from ORS');
        }
    }

    // Get autocomplete (place suggestions) 
    async getAutoCompleteSuggestions(input: string) {
        if (!input) throw new BadRequestException('Input is required');

        const url = `${this.baseUrl}/geocode/autocomplete?api_key=${this.orsToken}&text=${encodeURIComponent(
            input,
        )}&size=5`;

        try {
            const response = await axios.get(url);
            const features = response.data.features;

            return features.map((f: any) => f.properties.label);
        } catch (err) {
            console.error(err);
            throw new BadRequestException('Failed to fetch autocomplete suggestions');
        }
    }

    // find near by captain in the radius
    async getCaptainsInTheRadius(ltd: number, lng: number, radius: number) {
        try {
            const captains = await this.captainModel.find({
                location: {
                    $geoWithin: {
                        $centerSphere: [[ltd, lng], radius / 6371],
                    },
                },
            });
            return captains;
        } catch (err) {
            console.error(err);
            throw new BadRequestException('Failed to fetch captains in radius');
        }
    }
}

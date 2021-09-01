//const { ILocation, IPost } = require("./Interfaces.ts");
function toRadians(degrees) {
	return (degrees * Math.PI) / 180;
}

module.exports.isInRadius = function (
	pointA, //: ILocation,
	pointB, //: ILocation,
	radiusInKm //: number
) {
	//: boolean
	//First check diff between latitudes. Each degree of latitude is approx
	//111km apart. Check that latitudes are within reach
	const latitudeFarEnoughApart =
		Math.abs(pointA.latitude - pointB.latitude) * 111 < radiusInKm;
	if (!latitudeFarEnoughApart) return false;

	// great circle distance between two points with coordinates (latitude,longitude) given by:
	const distanceInRadians =
		2 *
		Math.asin(
			Math.sqrt(
				Math.pow(
					Math.sin(
						(toRadians(pointA.latitude) - toRadians(pointB.latitude)) / 2
					),
					2
				) +
				Math.cos(toRadians(pointA.latitude)) *
				Math.cos(toRadians(pointB.latitude)) *
				Math.pow(
					Math.sin(
						(toRadians(pointA.longitude) - toRadians(pointB.longitude)) / 2
					),
					2
				)
			)
		);

	//find the distance in km between the two points by distance_km ≈ radius_km * distance_radians ≈ 6371 * d
	//where 6371 is the average radius of the earth

	const distanceInKm = 6371 * distanceInRadians;

	return distanceInKm < radiusInKm;
}
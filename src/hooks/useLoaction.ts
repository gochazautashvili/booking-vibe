import { Country, State, City } from "country-state-city";
import { getAllStates } from "country-state-city/lib/state";
import { string } from "zod";
const useLocation = () => {
  const getCountryByCode = (countryCode: string) => {
    return Country.getAllCountries().find(
      (country) => country.isoCode === countryCode
    );
  };

  const getStateByCode = (countryCode: string, stateCode: string) => {
    const state = State.getAllStates().find(
      (state) =>
        state.countryCode === countryCode && state.isoCode === stateCode
    );

    if (!state) return null;

    return state;
  };

  const getCountryStates = (CountryCode: string) => {
    return State.getAllStates().filter(
      (state) => state.countryCode === CountryCode
    );
  };

  const getStateCities = (CountryCode: string, stateCode?: string) => {
    return City.getAllCities().filter(
      (city) => city.countryCode === CountryCode && city.stateCode === stateCode
    );
  };

  return {
    getAllCountries: Country.getAllCountries,
    getCountryByCode,
    getStateByCode,
    getCountryStates,
    getStateCities,
  };
};

export default useLocation;

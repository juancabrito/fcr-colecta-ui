import React, { Component } from 'react'
import { getCities, getActivePlaces } from '../../api'
import Select from 'material-ui/Select'
import { MenuItem } from 'material-ui/Menu';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Grid from 'material-ui/Grid';

import PlacesMap from '../PlacesMap';

export default class ChoosePlace extends Component {

  constructor(props) {
    super(props)
    this.state = {
      cities: [],
      currentCityId: "",
      currentCity: {},
      places: [],
      currentPlace: ""
    }
    this.loadCities = this.loadCities.bind(this)
    this.showCities = this.showCities.bind(this)
    this.updatePlaces = this.updatePlaces.bind(this)
    this.loadCities()
  }

  loadCities = () => {
    getCities()
      .then((response) => {
        this.setState({cities: response.response.data})
    })
  }

  showCities = () => {
    let cities = this.state.cities.map((city) => {
      return <MenuItem key={city.id} value={city.id}>{city.name}</MenuItem>
    })
    return cities
  }

  updatePlaces = (event) => {
    let cityId = event.target.value;
    let city = this.state.cities.filter(city => city.id === cityId)[0]
    this.setState({currentCity: city})
    getActivePlaces({cityId: cityId})
      .then((response) => {
        this.setState({places: response.response.data})
    })
  }

  renderIf = (condition, content) => {
    if (condition) {
      return content;
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className="personal-data">
        <header className="App-header">
          <h1 className="App-title">Escoja el lugar</h1>
        </header>
        <Grid container>
          <Grid item xs={12}>
          <FormControl>
            <InputLabel htmlFor="city-selector">Ciudad</InputLabel>
            <Select
              value={this.state.currentCityId}
              onChange={this.updatePlaces}
              inputProps={{id: 'city-selector'}}
            >
              {this.showCities()}
            </Select>
            <FormHelperText>Selecciona la ciudad</FormHelperText>
          </FormControl>
          </Grid>
          <Grid item xs={4} style={{maxHeight: "100px"}}>
            {
              this.renderIf(
                this.state.currentCity.id != null,
                <PlacesMap
                  coordinates={{
                    lat: this.state.currentCity.latitude,
                    lng: this.state.currentCity.longitude
                  }}
                  places={this.state.places}
                  currentPlace={this.state.place}
                  onUpdateMap={this.updateMap}
                />
              )
            }
          </Grid>
        </Grid>

      </div>
    )
  }
}

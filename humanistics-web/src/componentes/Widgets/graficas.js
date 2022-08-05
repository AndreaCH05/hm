//Dependencias
import React, { Component } from 'react';
import ReactEcharts from "echarts-for-react";
import { Row } from 'antd';

const axios = require('axios').default;



class Estatus_chart extends Component {
	pie3 = () => ({
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b}: {c} ({d}%)'
		},

		legend: {
			orient: 'horizontal',
			bottom: 0,
			left: 0,
			data: this.props.data.map(estatus => estatus.nombre),
			textStyle: {
				// color: '#ad18d6',
			},
			type: 'scroll'
		},

		series: [
			{
				name: 'Total',
				type: 'pie',
				radius: ['0%', '0%'],
				color: 'transparent',
				label: {
					position: 'inner',
					fontSize: '30',
					fontWeight: 'bold',
					backgroundColor: 'transparent',
					color: '#ad18d6',
					borderColor: 'transparent',
					margin: '-5px',
				},

				labelLine: {
					show: false,
					padding: '5px',
				},


			},
			{
				name: 'Prospectos',
				type: 'pie',
				radius: ['40%', '60%'],
				label: { show: false },

				data: this.props.data.map(estatus => {
					return {
						value: estatus.count, name: estatus.nombre, itemStyle: {
							color: `#${estatus.color}`
						}
					}
				})
			}
		]
	});

	render() {
		return (
			<div style={{ width: '100%' }} className="card-chart">
				<Row className="pd-1">
					<h2 className="ant-page-header-heading-title"> Proyectos por Estatus</h2>
				</Row>
				<ReactEcharts option={this.pie3()} style={{ height: 300, width: '100%' }} />
			</div>
		);
	}
}

class Ingresos_chart extends Component {
	option = () => {
		let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
		return {
			tooltip: {},
			toolbox: {
				show: true,
				feature: {
					dataView: { readOnly: false },
					restore: {},
					saveAsImage: {}
				}
			},
			dataZoom: {
				show: false,
				start: 0,
				end: 100
			},
			xAxis: {
				data: this.props.data.map(ventas => {
					let mes = ventas.mes - 1
					return meses[mes]
				})
			},
			yAxis: {},
			series: [{
				name: 'Ventas Netas',
				type: 'bar',
				data: this.props.data.map(ventas => {
					return ventas.count
				})
			}]
		}
	}


	render() {
		return (
			<div style={{ width: '100%' }} className="card-chart">
				<Row className="pd-1">
					<h2 className="ant-page-header-heading-title"> Ventas Mensuales</h2>
				</Row>
				<ReactEcharts option={this.option()} style={{ height: 695, width: '100%' }} />
			</div>
		);
	}
}

class Ventas_chart extends Component {

	state = {
		mes: -1,
		pagos: [],
		proyectos: [],
		diasMes: [],
		data: []
	};

	componentDidMount = async () => {

		var _mes = this.state.mes;

		let mes = (_mes + 1).toString();

		if (mes.length === 1) { mes = "0" + mes }

		let anio = new Date().getFullYear();

		let fecha = anio + "-" + mes + "-01" + "T00:00:00.000Z"

		let inicio = new Date(fecha);
		let getLastDay = new Date(anio, _mes + 1, 0);

		let firstDay = inicio;
		let lastDay = anio + '-' + (('' + getLastDay.getMonth()).length < 2 ? '0' : '') + (getLastDay.getMonth() + 1) + '-' + (('' + getLastDay.getDate()).length < 2 ? '0' : '') + getLastDay.getDate() + "T23:59:59.000Z";

		var diferenciadias = getLastDay.getDate();

		var diaActual = 0;
		var ArrayDias = []
		for (let index = 0; index < diferenciadias; index++) {
			diaActual++;
			var dia = diaActual.toString();

			if (dia.lenght === 0) { dia = "0" + dia }
			ArrayDias.push(dia);
		}

		this.setState({ diasMes: ArrayDias })
	}


	componentDidUpdate = async () => {

		if (this.state.mes !== this.props.mes && this.state.data.length !== this.props.data.length) {
			var _mes = this.props.mes;

			let mes = (_mes + 1).toString();

			if (mes.length === 1) { mes = "0" + mes }

			let anio = new Date().getFullYear();

			let fecha = anio + "-" + mes + "-01" + "T00:00:00.000Z"

			let inicio = new Date(fecha);
			let getLastDay = new Date(anio, _mes + 1, 0);

			var diferenciadias = getLastDay.getDate();

			var diaActual = 0;
			var ArrayDias = [];
			var ArrayFechas = [];


			for (let index = 0; index < diferenciadias; index++) {
				diaActual++;
				var dia = diaActual.toString();
				if (dia.length === 1) { dia = "0" + dia }

				ArrayDias.push(dia);

				let _fecha = anio + "-" + mes + "-" + dia;
				ArrayFechas.push(_fecha);

			}

			var ArrayProyectos = [];
			var ArrayPagos = [];

			var data = this.props.data;

			for (let index = 0; index < ArrayFechas.length; index++) {
				const fecha = ArrayFechas[index];

				var total = 0;
				for (let index = 0; index < data.length; index++) {
					const reg = data[index];
					var fechaReg = new Date(reg.createdAt);

					var a = fechaReg.getFullYear();
					var b = (fechaReg.getMonth() + 1).toString();
					var c = (fechaReg.getDate()).toString();

					if (b.length === 1) { b = "0" + b }
					if (c.length === 1) { c = "0" + c }


					let regFecha = a + "-" + b + "-" + c;

					if (regFecha === fecha) {
						total = reg.total;
					}
				}

				ArrayPagos.push(total);
			}

			this.setState({
				diasMes: ArrayDias,
				pagos: ArrayPagos,
				mes: this.props.mes,
				data: this.props.data
			});
	 
		}
	}


	option = () => {
		return {
			title: {
				text: ''
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					label: {
						backgroundColor: '#6a7985'
					}
				}
			},

			legend: {},


			toolbox: {
				show: true,
				feature: {
					saveAsImage: {
						show: true,
						title: 'Descargar',
						iconStyle: {
							borderColor: '#666',
						},
					},
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: [
				{
					type: 'category',
					boundaryGap: false,
					data: this.state.diasMes
				}
			],
			yAxis: [
				{
					type: 'value'
				}
			],
			series: [
				{
					name: '',
					type: 'line',
					stack: 'total',
					areaStyle: {},
					emphasis: {
						focus: 'series'
					},
					data: this.state.pagos
				},

			]
		}
	};

	render() {
		return (
			<div style={{ width: '100%' }} className="card-chart">
				<ReactEcharts option={this.option()} style={{ height: 695, width: '100%' }} />
			</div>
		);
	}
}



class Ventas_prospectos  extends Component {

	state = {
		mes: -1,
		pagos: [],
		proyectos: [],
		diasMes: [],
		data: []
	};

	componentDidMount = async () => {

		var _mes = this.state.mes;

		let mes = (_mes + 1).toString();

		if (mes.length === 1) { mes = "0" + mes }

		let anio = new Date().getFullYear();

		let fecha = anio + "-" + mes + "-01" + "T00:00:00.000Z"

		let inicio = new Date(fecha);
		let getLastDay = new Date(anio, _mes + 1, 0);

		let firstDay = inicio;
		let lastDay = anio + '-' + (('' + getLastDay.getMonth()).length < 2 ? '0' : '') + (getLastDay.getMonth() + 1) + '-' + (('' + getLastDay.getDate()).length < 2 ? '0' : '') + getLastDay.getDate() + "T23:59:59.000Z";

		var diferenciadias = getLastDay.getDate();

		var diaActual = 0;
		var ArrayDias = []
		for (let index = 0; index < diferenciadias; index++) {
			diaActual++;
			var dia = diaActual.toString();

			if (dia.lenght === 0) { dia = "0" + dia }
			ArrayDias.push(dia);
		}

		this.setState({ diasMes: ArrayDias })
	}


	componentDidUpdate = async () => {

		if (this.state.mes !== this.props.mes && this.state.data.length !== this.props.data.length) {
			var _mes = this.props.mes;

			let mes = (_mes + 1).toString();

			if (mes.length === 1) { mes = "0" + mes }

			let anio = new Date().getFullYear();

			let fecha = anio + "-" + mes + "-01" + "T00:00:00.000Z"

			let inicio = new Date(fecha);
			let getLastDay = new Date(anio, _mes + 1, 0);

			var diferenciadias = getLastDay.getDate();

			var diaActual = 0;
			var ArrayDias = [];
			var ArrayFechas = [];



			for (let index = 0; index < diferenciadias; index++) {
				diaActual++;
				var dia = diaActual.toString();
				if (dia.length === 1) { dia = "0" + dia }

				ArrayDias.push(dia);

				let _fecha = anio + "-" + mes + "-" + dia;
				ArrayFechas.push(_fecha);

			}

			var ArrayProyectos = [];
			var ArrayPagos = [];

			var data = this.props.data;
			


			for (let index = 0; index < ArrayFechas.length; index++) {
				const fecha = ArrayFechas[index];

				var total = 0;

				for (let index = 0; index < data.length; index++) {
					const reg = data[index];

					var a = reg._id.anio.toString();
					var b = reg._id.mes.toString();
					var c = reg._id.dia.toString();

					if (b.length === 1) { b = "0" + b }
					if (c.length === 1) { c = "0" + c }


					let regFecha = a + "-" + b + "-" + c;
				 

					if (regFecha === fecha) {
						total = reg.count;
					}
				}

				ArrayPagos.push(total);
			}


			this.setState({
				diasMes: ArrayDias,
				pagos: ArrayPagos,
				mes: this.props.mes,
				data: this.props.data
			});
			 
		 
		}
	}


	option = () => {
		return {
			title: {
				text: ''
			},

			tooltip: {
				trigger: 'axis',
				position: function (pt) {
					return [pt[0], '10%'];
				},
				axisPointer: {
					type: 'cross',
					label: {
						backgroundColor: '#93CE07'
					},

				}
			},

			legend: {},


			toolbox: {
				show: true,
				feature: {
					saveAsImage: {
						show: true,
						title: 'Descargar',
						iconStyle: {
							borderColor: '#666',
						},
					},
				}
			},

			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},

			xAxis: [
				{
					type: 'category',
					boundaryGap: false,
					data: this.state.diasMes,
					
					splitLine: {
						show: false
					}
					 
				}
			],
			yAxis: [
				{
					type: 'value',
					boundaryGap: false,
					boundaryGap: [0, '100%'],
					splitLine: {
						show: false
					}

				}
			],
			series: [
				{
					type: 'line',
					showSymbol: false,
					hoverAnimation: false,
					data: this.state.pagos,
					color: '#93CE07',
					stack: 'total',
					
					smooth: true,

					showSymbol: false,
					hoverAnimation: false,
				
					//   areaStyle: {
					//  	color:"#93ce0761"
					//   },

				},
			],

		}
	};

	render() {
		return (
			<div style={{ width: '100%' }} className="card-chart">
				<ReactEcharts option={this.option()} style={{ height: 695, width: '100%' }} />
			</div>
		);
	}
}

 

export { Estatus_chart, Ingresos_chart, Ventas_chart, Ventas_prospectos }

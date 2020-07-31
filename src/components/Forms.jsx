import React, { useEffect, useState } from 'react';

import { FiCheck } from 'react-icons/fi';

import { useForm } from "react-hook-form";

import axios from 'axios';

import Header from './Header';

import * as Yup from "yup";


/* Enxergo oportunidades de melhoria na validação como React Hook Form e Formkit ;) */


const formSchema = Yup.object().shape({
    name: Yup.string()
        .required('Informe um nome válido!'),
    age: Yup.number()
        .required('Informe uma idade válida')
        .positive()
        .integer(),
    uf: Yup.string().required(),
    city: Yup.string().required()
});

const Componente = () => {

    const { register, handleSubmit, errors } = useForm({
        validationSchema: formSchema
      });
    const onSubmit = data => {
        // alert(JSON.stringify(data));
        // handleSubmitResult(data); 
        setResults('', '', '', '');
        if(data.name === '') {
            alert ('Insira um nome válido')
        }
        else if (data.age <= 0 || data.age === '') {
            alert ('Insira uma idade válida')
        }
        else if (data.city === '' || data.uf === '') {
            alert ('Insira um endereço válido')
        } else {
            setResults(data);
        }
        // console.log(results);
    };
    

    const [ufs, setUfs] = useState([]);

    const [cities, setCities] = useState([]);

    const [selectedUf, setSelectedUf] = useState(''); 

    const [selectedCity, setSelectedCity] = useState(''); 

    const [results, setResults] = useState(['', '', '', '']);

    const [formData, setFormData] = useState({
        name: '',
        age: '',
    });

    useEffect(() => {
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);

            setUfs(ufInitials);
        });
    }, []);

    useEffect(() => {
        if (selectedUf === '') {
            return; 
        }
        axios
            .get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                const cityNames = response.data.map(city => city.nome);

                setCities(cityNames);
            });

    }, [selectedUf]); 


    function handleSelectedUf(event) {
        const uf = event.target.value;

        setSelectedUf(uf);
    }

    function handleSelectedCity(event) {
        const city = event.target.value;

        setSelectedCity(city);
    }

    function handleInputChange(event) {
        const { name, value } = event.target    

        setFormData({ ...formData, [name]: value });
    }

    // async function handleSubmitResult(results) {
    //     // const { name, age } = formData;
    //     // const uf = selectedUf;
    //     // const city = selectedCity;

    //     // console.log(name, age, uf, city);

    //     // setResults([name, age, uf, city]);
    // }

    return (
        <div>
            <div className="content">
                <Header title="Formulário" />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="forms">

                        <fieldset>
                            <legend>
                                <h2>Dados</h2>
                            </legend>

                            <div className="forms__field">
                                <label htmlFor="name">Nome</label>
                                <input
                                    type="text"
                                    placeholder="Exemplo: Juliana Witzke de Brito"
                                    name="name"
                                    id="name"
                                    ref={register}
                                    onChange={handleInputChange}
                                />
                                {errors.name && <p>{errors.name.message}</p>}
                            </div>
                            <div className="forms__field">
                                <label htmlFor="age">Idade</label>
                                <input
                                    type="number"
                                    placeholder="Exemplo: 22"
                                    name="age"
                                    id="age"
                                    ref={register}
                                    onChange={handleInputChange}
                                />
                                {errors.age && <p>{errors.age.message}</p>}
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>
                                <h2>Endereço</h2>
                            </legend>

                            <div className="forms__field-group">
                                <div className="forms__field">
                                    <label htmlFor="uf">Estado (UF)</label>
                                    <select
                                        name="uf"
                                        id="uf"
                                        value={selectedUf}
                                        onChange={handleSelectedUf}
                                        ref={register}
                                    >
                                        <option value="" >Selecione uma UF</option>
                                        {ufs.map(uf => (
                                            <option key={uf} value={uf}>{uf} </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="forms__field">
                                    <label htmlFor="city">Cidade</label>
                                    <select
                                        name="city"
                                        id="city"
                                        value={selectedCity}
                                        onChange={handleSelectedCity}
                                        ref={register}
                                    >
                                        <option value="">Selecione uma cidade</option>
                                        {cities.map(city => (
                                            <option key={city} value={city}>{city} </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </fieldset>
                        
                        <button type="submit" className="forms__button" onClick={handleSubmit}>
                            <p>
                                <strong>
                                    Enviar formulário
                                </strong>
                            </p>
                            <FiCheck
                                color="green"
                                size='18'
                                stroke="green"
                                strokeWidth="6"
                            />
                        </button>
                    </div>
                </form>
            </div>

            <div className="content">
                <Header title="Resultado" />
                <div className="content__results">
                    <p>{results.name}</p>
                    <p>{results.age}</p>
                    <p>{results.uf}</p>
                    <p>{results.city}</p>
                    {/* {
                        results.map(result=> (
                            <p key={result}>{result}</p>
                        ))

                    } */}
                </div>
            </div>
        </div>
    );
}

export default Componente;
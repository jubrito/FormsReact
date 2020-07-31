import React, { useEffect, useState } from 'react';

import { FiCheck } from 'react-icons/fi';

import axios from 'axios';

import Header from './Header';



// FIELDSET: Conjunto de campos, LEGEND: legenda do fieldset
// SELECT:  impedir que a cidade não condiza com o estado e uf OU city que não sejam validos

/* MAPA: seguindo exemplo do que foi importado e como os componentes foram utilizados em A simple Marker with Popup de https://react-leaflet.js.org/docs/en/examples 
    - center: recebe um array [latitude, longitude]
    - pegar coordenadas no google.maps (primeiro aparece latitude, depois long depois o zoom)
    - TyleLayer: Layout do mapa (open streen map, copiado do exemplo)
*/

/* Para evitar que toda alteração feita em CreatePoint execute tudo de novo, não colocamos api.get dentro do componente. Mas fora não faz sentido porque pertence ao componente
    useEffect(
        qual função quero executar,
        quando? (quando tal informação mudar, por exemplo se colocassemos {counter}). Se deixarmos [] será executado uma única vez
    )
*/


const Componente = () => {

    // Estado para armazenar as ufs
    const [ufs, setUfs] = useState([]); // vetor de textos (ufs sao strings)

    // Estado para armazenar as cidades
    const [cities, setCities] = useState([]);

    // Uf que o usuário selecionou (armazenar em estado do componente)
    const [selectedUf, setSelectedUf] = useState('0'); // useState('0') pq a option do "Selecione uma uf" tem value="0"

    // Uf que o usuário selecionou (armazenar em estado do componente)
    const [selectedCity, setSelectedCity] = useState('0'); // useState('0') pq a option do "Selecione uma uf" tem value="0"

    // DADOS FINAIS
    const [results, setResults] = useState(['', '', '', '']);

    // Inputs do ponto de coleta
    const [formData, setFormData] = useState({
        name: '',
        age: '',
    });

    // const history = useHistory(); // redirecionar o usuário depois do ponto de coleta para a tela inicial


    // ------------ BUSCAR AS UFS DA API DO IBGE ------------
    useEffect(() => {
        // se usassemos api.get usaria a baseURL (localhost) 
        // retirado de: https://servicodados.ibge.gov.br/api/docs/localidades?versao=1
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);

            setUfs(ufInitials);
        });
    }, []);

    // ------------ CARREGAR AS CIDADES SEMPRE QUE A UF FOR SELECIONADA  ------------
    // Precisamos armazenar o conteúdo dos inputs das ufs em estados do componente
    useEffect(() => {
        // retirado de: https://servicodados.ibge.gov.br/api/docs/localidades?versao=1#api-Municipios-estadosUFMunicipiosGet
        if (selectedUf === '0') {
            return; // trata o inicio
        }
        axios
            .get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                const cityNames = response.data.map(city => city.nome);

                setCities(cityNames);
            });

    }, [selectedUf]); // executa sempre que selectedUf mudar


    function handleSelectedUf(event) {
        // Chamada toda vez que o usuário mudar a uf, recebe um evento 
        // por causa do typescript, como não sabemos o tipo do evento, importamos o ChangeEvent (evento do tipo de formulário)
        // ChangeEvent<HTMLSelecElement>: recebe a tipagem de qual é o elemento alterado (evento de alteração de um HTML Select Element, variavel global do react )
        // Colocamos no select "value={selectedUf}" para que toda vez que essa variavel mudar refletir as alterações no select
        const uf = event.target.value;

        setSelectedUf(uf);
    }

    function handleSelectedCity(event) {
        const city = event.target.value;

        setSelectedCity(city);
    }

    function handleInputChange(event) {
        const { name, value } = event.target

        // Spread: Se apenas um dele é alterado, precisamos manter o dos outros quando o estado for alterado (copiamos o resto no objeto)
        // [name] ira substituir a informação específica (usa o nome da propriedade a ser alterada como variavel)
        setFormData({ ...formData, [name]: value });
    }


    // Enviar para a API o novo ponto de coleta criado
    // colocamos no <form com onSubmit (função disparada assim que o usuario der um submit, pega tanto quando da enter quanto quando clica no botão)
    async function handleSubmit(event) {
        // O funcionamento padrão do formulário no HTML envia o usuário em uma outra tela, para evitar isso:
        event.preventDefault();

        const { name, age } = formData;
        const uf = selectedUf;
        const city = selectedCity;

        console.log(name, age, uf, city);
        setResults([name, age, uf, city]);

        console.log(results);

        // await api.post('points', data);
        // redirecionar para a home
        // history.push('/');
    }

    return (

        <div>
            <div className="content">
                <Header title="Formulário" />

                <form onSubmit={handleSubmit}>
                    <div className="forms">

                        {/* ----- DADOS ----- */}
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
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="forms__field">
                                <label htmlFor="age">Idade</label>
                                <input
                                    type="number"
                                    placeholder="Exemplo: 22"
                                    name="age"
                                    id="age"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </fieldset>

                        {/* ----- ENDEREÇO ----- */}
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
                                    >
                                        <option value="0" >Selecione uma UF</option>
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
                                    >
                                        <option value="0">Selecione uma cidade</option>
                                        {cities.map(city => (
                                            <option key={city} value={city}>{city} </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </fieldset>
                        
                        <button type="submit" className="forms__button" onclick={handleSubmit}>
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
                <div class="content__results">
                    {

                        results.map(result=> (
                            <p>{result}</p>
                        ))

                    }
                </div>
            </div>
        </div>
    );
}

export default Componente;
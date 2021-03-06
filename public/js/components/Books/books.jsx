import React, { PropTypes, Component } from 'react'

import 'react-dom';
import 'moment';
import 'numbro';
import 'pikaday';
import 'zeroclipboard';
import 'handsontable';

import HandsOnTable from '../../static/handsontable';
import 'handsontable/dist/handsontable.full.css';

export default class Books extends Component {
    saveBooks() {
        console.log("Save button has been clicked!");
        this.props.saveBooks(this.elements);
    }

    setDirty() {
        if(!this.props.isDirty) {
            this.props.setDirty(true);
        }
    }

    customRenderer(instance, td, row, col, prop, value, cellProperties) {
        let idArray;
        let rootDiv = document.createElement('div');

        try {
            idArray = JSON.parse(value);

            if(idArray instanceof Array) {

                idArray.forEach( (element) => {
                    this.props.authors.forEach( (author) => {
                        if(author["_id"] == element) {
                            rootDiv.innerHTML +=    `<div class = "subCell">` +
                                                       `ID: ${author["_id"]}
                                                        <b>${author["firstName"]} ${author["secondName"]}</b> 
                                                        Дата рождения: ${author["birthDate"]} 
                                                        Email: ${author["email"]}` +
                                                    `</div>`;
                        }
                    })
                });
            } else {
                rootDiv.innerHTML = "Отсутствуют";
            }

            if( rootDiv.innerHTML == "" ) {
                rootDiv.innerHTML = "Отсутствуют";
            }

        } catch (error) {
            rootDiv.innerHTML = "Отсутствуют";
        }

        Handsontable.Dom.empty(td);
        td.appendChild(rootDiv);

        return td;
    }

    componentWillMount() {
        this.props.getAuthors();
        this.props.getBooks();
    }

    render() {
        const vm = this;
        const columnsHeaders = ['Id', 'Название', 'Издательство', 'Эл. книга', 'Год', 'isbn', 'Страницы', 'Авторы'];
        const columnsType = [
            {
                data: '_id'
            },
            {
                data: 'name'
            },
            {
                data: 'publishing'
            },
            {
                data: 'ebook',
                type: 'checkbox'
            },
            {
                data: 'year',
                type: 'numeric'
            },
            {
                data: 'isbn'
            },
            {
                data: 'pages',
                type: 'numeric'
            },
            {
                data: 'author',
                renderer: vm.customRenderer.bind(vm)
            }
        ];

        vm.elements = JSON.parse(JSON.stringify(vm.props.books)); // TODO: FixMe!

        return (
            <div className="contentContainer">
                <button
                    onClick={vm.saveBooks.bind(vm)}
                    className={"saveBtn" + (!(vm.props.isDirty)? " invisible" : "")}
                >
                    { "Save" }
                </button>
                <div className="hotRootContainer">
                    <div className="hotContainer">
                        <HandsOnTable
                            colHeaders={columnsHeaders}
                            data={vm.elements}
                            stretchH="last"
                            columns={columnsType}
                            columnSorting={true}
                            afterSetDataAtCell={vm.setDirty.bind(vm)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

Books.propTypes = {
    getBooks: PropTypes.func.isRequired,
    getAuthors: PropTypes.func.isRequired,
    saveBooks: PropTypes.func.isRequired,
    setDirty: PropTypes.func.isRequired,
    authors: PropTypes.array.isRequired,
    books: PropTypes.array.isRequired,
    isDirty: PropTypes.bool.isRequired
};
import {div, h2, h3, img, para, polynoteLogo, span, tag, TagElement} from "../tags";
import {RecentNotebooks, RecentNotebooksHandler} from "../../state/preferences";
import {ServerStateHandler} from "../../state/server_state";
import {Disposable} from "../../state/state_handler";

export class Home extends Disposable {
    readonly el: TagElement<"div">;

    constructor() {
        super()
        const recentNotebooks = tag('ul', ['recent-notebooks'], {}, []);
        this.el = div(['welcome-page'], [
            polynoteLogo(),
            h2([], ["Home"]),
            para([], [
                "To get started, open a notebook by clicking on it in the Notebooks panel, or create a new notebook by\n" +
                "             clicking the Create Notebook (",
                span(['create-notebook', 'icon'], [img(["icon"], "static/style/icons/fa/plus-circle.svg")]), ") button."
            ]),
            h3([], ["Recent Notebooks"]),
            recentNotebooks
        ]);

        const handleRecents = (recents: RecentNotebooks) => {
            recentNotebooks.innerHTML = "";
            recents.forEach(({name, path}) => {
                recentNotebooks.appendChild(tag('li', ['notebook-link'], {}, [
                    span([], [path]).click(() => ServerStateHandler.loadNotebook(path, true).then(() => {
                        ServerStateHandler.selectNotebook(path)
                    }))
                ]))
            })
        }
        handleRecents(RecentNotebooksHandler.state)
        RecentNotebooksHandler.addObserver(nbs => handleRecents(nbs), this)
    }
}
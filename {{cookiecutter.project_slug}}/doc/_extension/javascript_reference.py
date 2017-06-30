# :coding: utf-8

from docutils import nodes


def javascript_reference(
    name, rawtext, text, lineno, inliner, options=None, content=None
):
    """Return link to an Javascript reference for *text*.

    *name* should be the role name used in the document.
    *rawtext* should be the entire markup snippet, including the role whilst
    *text* is just the text marked with the role.

    *lineno* should be the line number where rawtext appears in the input.
    *inliner* should be the calling inliner instance.

     *options* should be a mapping of additional options for further
     customisation and *content* a list of additional context that may be
     supplied for customisation.

    Return tuple of list of nodes to insert and list of system messages.

    """
    app = inliner.document.settings.env.app

    reference = (
        "{reference_url}/{id}"
        .format(
            reference_url=app.config.reference_url,
            id=text,
        )
    )

    title = text.rsplit("/", 1)[-1]
    node = nodes.reference(rawtext, title, refuri=reference)
    return [node], []


def setup(app):
    """Install the plugin in the Sphinx *app* context."""
    app.add_role_to_domain("js", "external", javascript_reference)
    app.add_config_value(
        "reference_url",
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference",
        "env"
    )

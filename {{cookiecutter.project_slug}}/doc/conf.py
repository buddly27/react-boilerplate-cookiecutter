# :coding: utf-8

"""{{ cookiecutter.project }} documentation build configuration file."""

import os
import json
import sys

# -- General ------------------------------------------------------------------

# Extensions.
extensions = [
    "sphinx.ext.extlinks",
    "sphinx.ext.intersphinx",
    "lowdown",
    "champollion"
]

# Add local extension(s).
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "_extension"))
extensions.append("javascript_reference")

# The suffix of source file names.
source_suffix = ".rst"

# The master toc-tree document.
master_doc = "index"

# General information about the project.
project = u"{{ cookiecutter.project }}"
copyright = u"{{ cookiecutter.year }}, {{ cookiecutter.author_name }}"

# Version
with open(
    os.path.join(os.path.dirname(__file__), "..", "package.json")
) as file_object:
    package_information = json.load(file_object)
    _version = package_information["version"]

version = _version
release = _version

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
exclude_patterns = ["_template"]

# -- Cross-Reference ----------------------------------------------------------

primary_domain = "js"

# -- HTML output --------------------------------------------------------------

html_theme = "sphinx_rtd_theme"

# If True, copy source rst files to output for reference.
html_copy_source = True

# -- Champollion  -------------------------------------------------------------

js_source = "./source/{{ cookiecutter.module_name }}"
js_module_options = ["members"]
js_class_options = ["members"]

# -- Intersphinx --------------------------------------------------------------

intersphinx_mapping = {
    "python": ("http://docs.python.org/", None)
}

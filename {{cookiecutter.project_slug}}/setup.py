# :coding: utf-8

import os

from setuptools import setup


ROOT_PATH = os.path.dirname(os.path.realpath(__file__))
README_PATH = os.path.join(ROOT_PATH, "README.rst")

VERSION = "0.1.0"

# Compute dependencies.
DOC_REQUIRES = [
    "sphinx >= 1.2.2, < 2",
    "sphinx_rtd_theme >= 0.1.6, < 1",
    "lowdown >= 0.1.0, < 2",
    "champollion >= 0.4.2, < 1"
]
INSTALL_REQUIRES = []
TEST_REQUIRES = []

setup(
    name="{{ cookiecutter.project_slug }}",
    version=VERSION,
    description="Documentation of {{ cookiecutter.project }}.",
    long_description=open(README_PATH).read(),
    url="{{ cookiecutter.repository }}",
    keywords="",
    author="{{ cookiecutter.author_name }}",
    install_requires=INSTALL_REQUIRES,
    tests_require=TEST_REQUIRES,
    extras_require={
        "doc": DOC_REQUIRES
    },
    zip_safe=False
)

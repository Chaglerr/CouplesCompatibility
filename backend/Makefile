
SRC_DIRS := app

format:
	ruff format $(SRC_DIRS)
	ruff check --fix $(SRC_DIRS)

lint:
	ruff format --check $(SRC_DIRS)
	ruff check $(SRC_DIRS)
	mypy $(SRC_DIRS)


install:
		./.venv/Scripts/python.exe -m pip install -r requirements.txt
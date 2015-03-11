PDFLATEX = pdflatex
BIBTEX = bibtex

TARGET = main

all:
	$(PDFLATEX) $(TARGET) 
	$(BIBTEX) $(TARGET)
	$(PDFLATEX) $(TARGET) 
	$(PDFLATEX) $(TARGET) 

clean:
	rm -f *.pdf *.dvi *.aux *.log *.bbl *.blg texput.log


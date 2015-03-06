LATEX  := pdflatex
TARGET := main
all:
	$(LATEX) $(TARGET) 
	bibtex $(TARGET)
	$(LATEX) $(TARGET) 
	$(LATEX) $(TARGET) 

clean:
	rm -f *.pdf *.dvi *.aux *.log *.bbl *.blg


package tree_sitter_mcfuncx_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_mcfuncx "github.com/PFiS1737/tree-sitter-mcfuncx/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_mcfuncx.Language())
	if language == nil {
		t.Errorf("Error loading Mcfuncx grammar")
	}
}

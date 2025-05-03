import XCTest
import SwiftTreeSitter
import TreeSitterMcfuncx

final class TreeSitterMcfuncxTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_mcfuncx())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Mcfuncx grammar")
    }
}

const input = 'mul 6 4 sum 5 6'

const mul = (...operands) => operands.reduce((a, c) => a * c, 1);
const sub = (...operands) => operands.reduce((a, c) => a - c);
const sum = (...operands) => operands.reduce((a, c) => a + c, 0);

// Lexer
const lex = str => str.split(' ').map(s => s.trim()).filter(s => s.length);
console.log(`Lexer Output`)
console.log(lex(input))
console.log(``);

// Parser
const Op = Symbol('op');
const Num = Symbol('num');

const parse = tokens => {

  let c = 0;

  const peek = () => tokens[c];
  const consume = () => tokens[c++];

  const parseNum = () => ({ val: parseInt(consume()), type: Num });

  const parseOp = () => {
    const node = { val: consume(), type: Op, expr: [] };
    while (peek()) node.expr.push(parseExpr());
    return node;
  };

  const parseExpr = () => /\d/.test(peek()) ? parseNum() : parseOp();

  return parseExpr();
};

console.log(`Parser Output`)
console.log(parse(lex(input)))
console.log(``)

const evaluate = ast => {
  const opAcMap = {
    sum: args => args.reduce((a, b) => a + b, 0),
    sub: args => args.reduce((a, b) => a - b),
    div: args => args.reduce((a, b) => a / b),
    mul: args => args.reduce((a, b) => a * b, 1)
  };

  if (ast.type === Num) return ast.val;
  return opAcMap[ast.val](ast.expr.map(evaluate));
};

console.log(`Evaluator Output`)
console.log(evaluate(parse(lex(input))))
console.log(``)

const transpile = ast => {
    const opMap = { sum: '+', mul: '*', sub: '-', div: '/' };
    const transpileNode = ast => ast.type === Num ? transpileNum(ast) : transpileOp(ast);
    const transpileNum = ast => ast.val;
    const transpileOp = ast => `(${ast.expr.map(transpileNode).join(' ' + opMap[ast.val] + ' ')})`;
    return transpileNode(ast);
};

console.log(`Transpiler Output`)
console.log(transpile(parse(lex(input))))
console.log(``)

console.log(eval(transpile(parse(lex(input)))))



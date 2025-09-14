import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calculator, History, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CalculationHistory {
  n: number;
  result: string;
  timestamp: Date;
}

const FibonacciCalculator: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  // Функция вычисления числа Фибоначчи
  const fibonacci = (n: number): string => {
    if (n === 0) return "0";
    if (n === 1) return "1";
    
    let a = BigInt(0);
    let b = BigInt(1);
    
    for (let i = 2; i <= n; i++) {
      const temp = a + b;
      a = b;
      b = temp;
    }
    
    return b.toString();
  };

  // Валидация ввода
  const validateInput = (value: string): boolean => {
    const num = parseInt(value);
    
    if (isNaN(num)) {
      setError('Пожалуйста, введите корректное число');
      return false;
    }
    
    if (num < 0) {
      setError('Число должно быть неотрицательным (n ≥ 0)');
      return false;
    }
    
    if (num > 45) {
      setError('Максимальное значение n = 45');
      return false;
    }
    
    setError('');
    return true;
  };

  // Обработка вычисления
  const handleCalculate = async () => {
    if (!validateInput(input)) {
      toast({
        title: "Ошибка ввода",
        description: error,
        variant: "destructive",
      });
      return;
    }
    
    setIsCalculating(true);
    
    // Имитация времени вычисления для UX
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const n = parseInt(input);
    const fibResult = fibonacci(n);
    
    setResult(fibResult);
    
    // Добавление в историю
    const newEntry: CalculationHistory = {
      n,
      result: fibResult,
      timestamp: new Date()
    };
    
    setHistory(prev => [newEntry, ...prev.slice(0, 4)]); // Оставляем только последние 5
    
    setIsCalculating(false);
    
    toast({
      title: "Вычисление завершено",
      description: `F(${n}) = ${fibResult}`,
    });
  };

  // Обработка Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCalculate();
    }
  };

  // Очистка формы
  const handleClear = () => {
    setInput('');
    setResult(null);
    setError('');
  };

  // Загрузка из истории
  const loadFromHistory = (n: number) => {
    setInput(n.toString());
    setError('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Заголовок */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Калькулятор Фибоначчи
        </h1>
        <p className="text-muted-foreground text-lg">
          Вычисление чисел последовательности Фибоначчи
        </p>
      </div>

      {/* Основная карточка калькулятора */}
      <Card className="card-gradient math-shadow">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            Вычисление
          </CardTitle>
          <CardDescription>
            Введите порядковый номер числа Фибоначчи (от 0 до 45)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Поле ввода */}
          <div className="space-y-2">
            <div className="flex gap-3">
              <Input
                type="number"
                placeholder="Введите n..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className={`flex-1 transition-all duration-300 ${
                  error ? 'border-destructive focus:ring-destructive' : 'focus:ring-primary'
                }`}
                min="0"
                max="45"
              />
              <Button 
                onClick={handleCalculate}
                disabled={isCalculating || !input}
                variant="mathematical"
                className="min-w-32"
              >
                {isCalculating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Вычисляю...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Вычислить
                  </div>
                )}
              </Button>
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>

          {/* Результат */}
          {result && (
            <div className="p-6 rounded-lg bg-primary/5 border-2 border-primary/20">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-primary">Результат:</h3>
                <div className="bg-card p-4 rounded-md math-shadow">
                  <p className="text-sm text-muted-foreground mb-1">
                    F({input}) =
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-primary break-all animate-number">
                    {result}
                  </p>
                </div>
                <Button
                  onClick={handleClear}
                  variant="fibonacci"
                  size="sm"
                >
                  Очистить
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* История вычислений */}
      {history.length > 0 && (
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-secondary" />
              История вычислений
            </CardTitle>
            <CardDescription>
              Последние {Math.min(history.length, 5)} вычислений
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.map((entry, index) => (
                <div
                  key={`${entry.n}-${entry.timestamp.getTime()}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/10 border border-secondary/20 hover:bg-secondary/20 transition-colors cursor-pointer"
                  onClick={() => loadFromHistory(entry.n)}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="min-w-12">
                      F({entry.n})
                    </Badge>
                    <span className="font-mono text-sm break-all">
                      {entry.result.length > 20 
                        ? `${entry.result.substring(0, 20)}...` 
                        : entry.result
                      }
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {entry.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Информационная карточка */}
      <Card className="card-gradient">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <h3 className="font-semibold text-primary">О последовательности Фибоначчи</h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Последовательность Фибоначчи - это ряд чисел, где каждое число является суммой двух предыдущих: 
              0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55...
            </p>
            <div className="flex justify-center gap-2 flex-wrap">
              {[0, 1, 5, 10, 20].map((n) => (
                <Button
                  key={n}
                  onClick={() => loadFromHistory(n)}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  F({n})
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FibonacciCalculator;
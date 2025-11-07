<?php 

abstract class Operation {
  protected $operand_1;
  protected $operand_2;
  public function __construct($o1, $o2) {
    // Make sure we're working with numbers...
    if (!is_numeric($o1) || !is_numeric($o2)) {
      throw new Exception('Non-numeric operand.');
    }
    
    // Assign passed values to member variables
    $this->operand_1 = $o1;
    $this->operand_2 = $o2;
  }
  public abstract function operate();
  public abstract function getEquation(); 
}

// Addition subclass inherits from Operation
class Addition extends Operation {
  public function operate() {
    return $this->operand_1 + $this->operand_2;
  }
  public function getEquation() {
    return $this->operand_1 . ' + ' . $this->operand_2 . ' = ' . $this->operate();
  }
}


// Part 1 - Add subclasses for Subtraction, Multiplication and Division here
//subtraction subclass
class Subtraction extends Operation {
  public function operate() {
    return $this->operand_1 - $this->operand_2;
  }
  public function getEquation() {
    return $this->operand_1 . ' - ' . $this->operand_2 . ' = ' . $this->operate();
  }
}

//multiplication subclass
class Multiplication extends Operation {
  public function operate() {
    return $this->operand_1 * $this->operand_2;
  }
  public function getEquation() {
    return $this->operand_1 . ' * ' . $this->operand_2 . ' = ' . $this->operate();
  }
}

//division subclass
class Division extends Operation {
  public function operate() {
    if ($this->operand_2 == 0) {
      //can throw or return something else, but throwing matches the rest of the code
      throw new Exception('Cannot divide by zero.');
    }
    return $this->operand_1 / $this->operand_2;
  }
  public function getEquation() {
    return $this->operand_1 . ' / ' . $this->operand_2 . ' = ' . $this->operate();
  }
}

// End Part 1




// Some debugs - un comment them to see what is happening...
// echo '$_POST print_r=>',print_r($_POST);
// echo "<br>",'$_POST vardump=>',var_dump($_POST);
// echo '<br/>$_POST is ', (isset($_POST) ? 'set' : 'NOT set'), "<br/>";
// echo "<br/>---";




// Check to make sure that POST was received 
// upon initial load, the page will be sent back via the initial GET at which time
// the $_POST array will not have values - trying to access it will give undefined message

  if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $o1 = $_POST['op1'];
    $o2 = $_POST['op2'];
  }
  $err = Array();


// Part 2 - Instantiate an object for each operation based on the values returned on the form
//          For example, check to make sure that $_POST is set and then check its value and 
//          instantiate its object
// 
// The Add is done below.  Go ahead and finish the remaining functions.  
// Then tell me if there is a way to do this without the ifs

  try {
    if (isset($_POST['add']) && $_POST['add'] == 'Add') {
      $op = new Addition($o1, $o2);
    }

    // Put the code for Part 2 here  \/

    if (isset($_POST['sub']) && $_POST['sub'] == 'Subtract') {
      $op = new Subtraction($o1, $o2);
    }

    if (isset($_POST['mult']) && $_POST['mult'] == 'Multiply') {
      $op = new Multiplication($o1, $o2);
    }

    if (isset($_POST['div']) && $_POST['div'] == 'Divide') {
      $op = new Division($o1, $o2);
    }

    // End of Part 2   /\

  }
  catch (Exception $e) {
    $err[] = $e->getMessage();
  }
?>

<!doctype html>
<html>
<head>
<title>Lab 6</title>
</head>
<body>
  <pre id="result">
  <?php 
    if (isset($op)) {
      try {
        echo $op->getEquation();
      }
      catch (Exception $e) { 
        $err[] = $e->getMessage();
      }
    }
      
    foreach($err as $error) {
        echo $error . "\n";
    } 
  ?>
  </pre>
  <form method="post" action="lab6.php">
    <input type="text" name="op1" id="name" value="" />
    <input type="text" name="op2" id="name" value="" />
    <br/>
    <!-- Only one of these will be set with their respective value at a time -->
    <input type="submit" name="add" value="Add" />  
    <input type="submit" name="sub" value="Subtract" />  
    <input type="submit" name="mult" value="Multiply" />  
    <input type="submit" name="div" value="Divide" />  
  </form>
</body>
</html>


<?php
/*
1) flow/what each class does:
- operation (abstract): stores the two numbers and makes sure they are numeric. also says that every operation must have operate() and getEquation().
- additoin/subtraction/multiplication/division: each one extends Operation and actually does the math in operate(). getEquation() just returns a string like "3 + 4 = 7".
- flow after clicking a button:
    a) form sends a POST back to this same file
    b) read $_POST['op1'] and $_POST['op2']
    c) check which submit button was set (add, sub, mult, div)
    d) based on that, we make a new object of the matching class
    e) We call $op->getEquation() to print the result inside <pre>

2) if used $_GET instead of $_POST:
   - values would show up in the URL like ?op1=3&op2=4&add=Add -- this could be nice for bookmarking or sharing, but it’s not as clean
   - for forms that “do work” (like a calculator) POST is usually nicer because it doesn’t clutter the URL

3) better way to tell which button was pressed:
   - currently: if (isset($_POST['add'])) { ... }
   - another way is to give all buttons the SAME name, like name="operation" but different values, like value="add", value="sub", etc.
   - then you just check $_POST['operation'] once and switch on that. That removes multiple ifs
*/
?>

package test;

import java.io.File;
import java.io.FileWriter;
import java.util.Iterator;

import org.rosuda.REngine.REXP;
import org.rosuda.REngine.REXPDouble;
import org.rosuda.REngine.REXPString;
import org.rosuda.REngine.RList;
import org.rosuda.REngine.Rserve.RConnection;

public class Test {
	public Test(String csv) {
		double[] myvalues = { 1.0, 1.5, 2.2, 0.5, 0.9, 1.12 };
		RConnection c = null;

		try {
			c = new RConnection();
			System.out.println("Hello");
			c.assign("myvalues", myvalues);
			REXP x = c.eval("mean(myvalues)");
			System.out.println(x.asDouble());
			x = c.eval("sd(myvalues)");
			System.out.println(x.asDouble());

			c.eval("source(\"source(\"/Users/yaozong/git/GIS/GIS2/WebContent/WEB-INF/RScripts/Palindrome.R\")");

			// call the function. Return true
			REXP is_aba_palindrome = c.eval("palindrome('"+"aba"+"')");
			System.out.println(is_aba_palindrome.asInteger()); // prints 1 =>
																// true

			// call the function. return false
			REXP is_abc_palindrome = c.eval("palindrome('abc')");
			System.out.println(is_abc_palindrome.asInteger()); // prints 0 =>
																// false

			File userFile = new File("/Users/yaozong/git/GIS/GIS2/WebContent/WEB-INF/canvas.csv");
			FileWriter writer = new FileWriter(userFile, false);
			writer.write(csv);
            writer.close();
			// call the function. return false
			// c.assign("csvInput", csv);
			
			REXP kenneth = c.eval("QuadratTest('"+csv+"')");
			double[] aa = kenneth.asDoubles();
			System.out.println(kenneth.isNumeric());
			for(double a : aa){
				System.out.println(a);
			}
			c.close();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (c != null) {
				try {
					c.close();

				} finally {
				}
			}
		}
	}
}

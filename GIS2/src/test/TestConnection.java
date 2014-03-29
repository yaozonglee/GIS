package test;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.rosuda.REngine.REXP;
import org.rosuda.REngine.Rserve.RConnection;

/**
 * Servlet implementation class TestConnection
 */
@WebServlet("/test")
public class TestConnection extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public TestConnection() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		RConnection c = null;

		try {
			c = new RConnection();
			
			c.eval("source(\"/Users/yaozong/git/GIS/GIS2/WebContent/WEB-INF/RScripts/Palindrome.R\")");

			
			REXP kenneth = c.eval("QuadratTest('/Users/yaozong/Documents/KinderGartens.geojson')");
			//double[] aa = kenneth.asDoubles();
			System.out.println(kenneth.toString());
//			for(double a : aa){
//				System.out.println(a);
//			}
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

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//		// TODO Auto-generated method stub
		String csv = request.getParameter("meh");
		System.out.println("csvcsv" + csv);
//		Test a = new Test(csv);
//		PrintWriter out = response.getWriter();
		
		RConnection c = null;

		try {
			c = new RConnection();
			
			c.eval("source(\"source(\"/Users/yaozong/git/GIS/GIS2/WebContent/WEB-INF/RScripts/Palindrome.R\")");

			
//			REXP kenneth = c.eval("QuadratTest('/Users/yaozong/Documents/KinderGartens.geojson')");
			REXP kenneth = c.eval("QuadratTest('"+csv+"')");
			//double[] aa = kenneth.asDoubles();
			System.out.println(kenneth.toString());
//			for(double a : aa){
//				System.out.println(a);
//			}
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
